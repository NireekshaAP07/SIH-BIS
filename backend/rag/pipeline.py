"""
BIS RAG Pipeline
Orchestrates retrieval + generation for the BIS Assistant.
"""

import json
from typing import Any

from .retriever import retrieve, is_collection_ready
from .llm import generate_response


async def run_pipeline(query: str, top_k: int = 5, language: str = "en") -> dict[str, Any]:
    """
    Full RAG pipeline: retrieve relevant BIS chunks, then generate a grounded response.

    Returns a dict with:
        answer: str             — The LLM-generated answer
        sources: list[dict]     — Retrieved source chunks (for citation display)
        standards: list[dict]   — Extracted IS standard references from chunks
        ready: bool             — Whether the RAG pipeline was fully used
    """
    if not is_collection_ready():
        return {
            "answer": (
                "The BIS knowledge base is not yet initialised. "
                "Please run the ingest pipeline: `python -m rag.ingest` from the backend/ directory."
            ),
            "sources": [],
            "standards": [],
            "ready": False,
        }

    # Step 1: Retrieve relevant chunks
    chunks = retrieve(query, top_k=top_k)

    if not chunks:
        return {
            "answer": (
                "I could not find relevant BIS information for your query. "
                "Please try rephrasing, or visit bis.gov.in for official information."
            ),
            "sources": [],
            "standards": [],
            "ready": True,
        }

    # Step 2: Generate LLM response grounded in retrieved chunks
    answer = await generate_response(query, chunks, language=language)

    # Step 3: Extract structured source info for frontend display
    sources = []
    standards = []
    seen_is = set()

    for chunk in chunks:
        source_entry = {
            "title": chunk.get("section", chunk.get("source_file", "BIS Document")),
            "section": chunk.get("section", ""),
            "source_file": chunk.get("source_file", ""),
            "doc_type": chunk.get("doc_type", ""),
            "clause": "—",
            "page": "—",
            "type": "Official BIS Source",
            "relevance_score": round(1 - chunk.get("distance", 0), 3),
        }

        # Determine display type
        if chunk.get("doc_type") == "standard":
            source_entry["type"] = "Indian Standard (BIS Publication)"
        elif "certification" in chunk.get("source_file", "").lower():
            source_entry["type"] = "BIS Certification Scheme Document"
        elif "qco" in chunk.get("source_file", "").lower():
            source_entry["type"] = "Quality Control Order Reference"
        elif "testing" in chunk.get("source_file", "").lower():
            source_entry["type"] = "BIS Testing Reference"

        sources.append(source_entry)

        # Collect unique IS number references
        is_num = chunk.get("is_number", "")
        if is_num and is_num not in seen_is:
            seen_is.add(is_num)
            standards.append({
                "number": is_num,
                "title": chunk.get("section", "").replace(f"{is_num} — ", ""),
                "source": chunk.get("source_file", ""),
            })

    return {
        "answer": answer,
        "sources": sources[:5],         # Top 5 sources for display
        "standards": standards[:3],      # Top 3 IS references
        "ready": True,
        "chunks_retrieved": len(chunks),
    }
