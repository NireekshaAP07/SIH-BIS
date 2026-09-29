"""
BIS RAG Ingest Pipeline
Chunks BIS knowledge base documents and embeds them into ChromaDB.
Run this once (or after updating data files) to populate the vector store.

Usage:
    python -m rag.ingest
"""

import json
import os
import re
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

DATA_DIR = Path(__file__).parent.parent / "data"
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
COLLECTION_NAME = "bis_knowledge"

# ── Chunk size settings ────────────────────────────────────────────────────────
CHUNK_SIZE = 800        # characters per chunk
CHUNK_OVERLAP = 100     # overlap between consecutive chunks


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks on paragraph or sentence boundaries."""
    paragraphs = [p.strip() for p in re.split(r'\n\n+', text) if p.strip()]
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) + 2 <= chunk_size:
            current_chunk += ("\n\n" if current_chunk else "") + para
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Carry over overlap from end of current chunk
                overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
                current_chunk = overlap_text + "\n\n" + para
            else:
                # Para itself is longer than chunk — split by sentences
                sentences = re.split(r'(?<=[.!?])\s+', para)
                for sentence in sentences:
                    if len(current_chunk) + len(sentence) + 1 <= chunk_size:
                        current_chunk += (" " if current_chunk else "") + sentence
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                            overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else current_chunk
                            current_chunk = overlap_text + " " + sentence
                        else:
                            chunks.append(sentence.strip())

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks


def load_markdown_document(file_path: Path) -> list[dict]:
    """
    Load a markdown document and split by major headings (##).
    Returns list of {section_title, content, source_file} dicts.
    """
    text = file_path.read_text(encoding="utf-8")
    sections = re.split(r'^## ', text, flags=re.MULTILINE)
    results = []

    for section in sections:
        if not section.strip():
            continue
        lines = section.strip().split('\n', 1)
        title = lines[0].strip().replace('#', '').strip() if lines else 'General'
        content = lines[1].strip() if len(lines) > 1 else ''

        if not content:
            continue

        for chunk in chunk_text(content):
            results.append({
                "section": title,
                "content": f"## {title}\n\n{chunk}",
                "source_file": file_path.name,
                "doc_type": "markdown",
            })

    return results


def load_standards_catalog(file_path: Path) -> list[dict]:
    """
    Load the standards catalog JSON and create one document per standard.
    Each standard entry becomes a richly formatted text chunk.
    """
    standards = json.loads(file_path.read_text(encoding="utf-8"))
    results = []

    for std in standards:
        text = f"""INDIAN STANDARD: {std['number']}
TITLE: {std['title']}
STATUS: {std['status']} ({std['year']})
DIVISION: {std.get('division_full', std.get('division', 'N/A'))}
COMMITTEE: {std.get('committee', 'N/A')}
MANDATORY: {'Yes' if std.get('mandatory') else 'No'}
QCO REFERENCE: {std.get('qco_ref', 'Not under a mandatory QCO')}
CERTIFICATION SCHEME: {std.get('cert_scheme', 'N/A')}
TAGS: {', '.join(std.get('tags', []))}

SCOPE:
{std['scope']}

TEST LABORATORIES:
{chr(10).join('- ' + lab for lab in std.get('test_labs', [])) if std.get('test_labs') else 'Contact BIS for recognised lab list'}
"""
        results.append({
            "section": f"{std['number']} — {std['title']}",
            "content": text,
            "source_file": "standards_catalog.json",
            "doc_type": "standard",
            "is_number": std["number"],
            "mandatory": std.get("mandatory", False),
        })

    return results


def ingest_all():
    """Main ingest function — load all data files, chunk, embed, and store in ChromaDB."""
    print(f"[BIS Ingest] Initialising ChromaDB at: {CHROMA_DB_PATH}")
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

    # Set up embedding function (local, no API key needed)
    print(f"[BIS Ingest] Loading embedding model: {EMBEDDING_MODEL}")
    emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    # Get or create collection (reset if re-ingesting)
    try:
        client.delete_collection(COLLECTION_NAME)
        print(f"[BIS Ingest] Deleted existing collection '{COLLECTION_NAME}' — re-ingesting")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        embedding_function=emb_fn,
        metadata={"hnsw:space": "cosine"},
    )
    print(f"[BIS Ingest] Created collection '{COLLECTION_NAME}'")

    all_docs = []

    # 1. Standards catalog
    standards_path = DATA_DIR / "standards_catalog.json"
    if standards_path.exists():
        docs = load_standards_catalog(standards_path)
        all_docs.extend(docs)
        print(f"[BIS Ingest] Loaded {len(docs)} standard chunks from {standards_path.name}")

    # 2. Markdown knowledge documents
    for md_file in DATA_DIR.glob("*.md"):
        docs = load_markdown_document(md_file)
        all_docs.extend(docs)
        print(f"[BIS Ingest] Loaded {len(docs)} chunks from {md_file.name}")

    if not all_docs:
        print("[BIS Ingest] ERROR: No documents found in data/ directory")
        return

    # Batch upsert into ChromaDB
    print(f"[BIS Ingest] Embedding and storing {len(all_docs)} chunks...")
    batch_size = 50

    for i in range(0, len(all_docs), batch_size):
        batch = all_docs[i : i + batch_size]
        collection.add(
            ids=[f"doc_{i + j}" for j, _ in enumerate(batch)],
            documents=[d["content"] for d in batch],
            metadatas=[
                {
                    "section": d.get("section", ""),
                    "source_file": d.get("source_file", ""),
                    "doc_type": d.get("doc_type", ""),
                    "is_number": d.get("is_number", ""),
                    "mandatory": str(d.get("mandatory", False)),
                }
                for d in batch
            ],
        )
        print(f"[BIS Ingest]   Stored batch {i // batch_size + 1}/{(len(all_docs) - 1) // batch_size + 1}")

    final_count = collection.count()
    print(f"[BIS Ingest] ✅ Done — {final_count} chunks in ChromaDB")


if __name__ == "__main__":
    ingest_all()
