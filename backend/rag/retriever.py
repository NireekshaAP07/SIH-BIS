"""
BIS RAG Retriever
Queries ChromaDB for the most relevant BIS knowledge chunks given a user query.
"""

import os
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

load_dotenv()

CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
COLLECTION_NAME = "bis_knowledge"
RAG_TOP_K = int(os.getenv("RAG_TOP_K", "5"))

# Singleton client — initialised once on import
_client: chromadb.ClientAPI | None = None
_collection = None
_emb_fn = None


def _get_collection():
    global _client, _collection, _emb_fn
    if _collection is not None:
        return _collection

    chroma_path = Path(CHROMA_DB_PATH)
    if not chroma_path.exists():
        raise RuntimeError(
            f"ChromaDB not found at '{CHROMA_DB_PATH}'. "
            "Please run the ingest pipeline first: python -m rag.ingest"
        )

    _emb_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )
    _client = chromadb.PersistentClient(path=str(chroma_path))
    _collection = _client.get_collection(
        name=COLLECTION_NAME,
        embedding_function=_emb_fn,
    )
    return _collection


def retrieve(query: str, top_k: int = RAG_TOP_K) -> list[dict]:
    """
    Retrieve the top_k most relevant BIS knowledge chunks for the given query.

    Returns a list of dicts:
        {
            "content": str,       # The chunk text
            "section": str,       # Section title / IS number
            "source_file": str,   # Which data file it came from
            "doc_type": str,      # "standard" | "markdown"
            "is_number": str,     # e.g. "IS 1786:2008" (empty for non-standard chunks)
            "distance": float,    # Cosine distance (lower = more similar)
        }
    """
    collection = _get_collection()

    results = collection.query(
        query_texts=[query],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        chunks.append({
            "content": doc,
            "section": meta.get("section", ""),
            "source_file": meta.get("source_file", ""),
            "doc_type": meta.get("doc_type", ""),
            "is_number": meta.get("is_number", ""),
            "distance": dist,
        })

    return chunks


def is_collection_ready() -> bool:
    """Check if the ChromaDB collection is populated and ready."""
    try:
        collection = _get_collection()
        return collection.count() > 0
    except Exception:
        return False
