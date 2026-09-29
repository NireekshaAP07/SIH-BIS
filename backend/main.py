"""
BIS Assistant Backend — FastAPI Application
Serves the RAG-powered BIS chat API and structured standards search.

Start with:
    uvicorn main:app --reload --port 8000

Endpoints:
    POST /api/chat        — RAG-powered BIS assistant
    GET  /api/standards   — Structured standards search/list
    GET  /api/status      — Health check and RAG readiness
"""

import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(override=True)

# ── Import RAG pipeline ────────────────────────────────────────────────────────
# (Initialised lazily on first request to avoid blocking startup)
from rag.pipeline import run_pipeline
from rag.retriever import is_collection_ready

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="BIS Assistant API",
    description="RAG-powered API for Indian Standards and BIS compliance information",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8443,http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Data Path ─────────────────────────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"
STANDARDS_PATH = DATA_DIR / "standards_catalog.json"


# ──────────────────────────────────────────────────────────────────────────────
# Request / Response Models
# ──────────────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    query: str
    top_k: int = 5          # Number of RAG chunks to retrieve
    language: str | None = "en"  # en, hi, kn, ta

class SourceItem(BaseModel):
    title: str
    section: str
    clause: str
    page: str
    type: str
    relevance_score: float | None = None

class StandardRef(BaseModel):
    number: str
    title: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceItem]
    standards: list[StandardRef]
    ready: bool
    chunks_retrieved: int | None = None


# ──────────────────────────────────────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────────────────────────────────────

@app.get("/api/status")
async def status():
    """Health check and RAG pipeline readiness."""
    rag_ready = is_collection_ready()
    return {
        "status": "ok",
        "rag_ready": rag_ready,
        "message": (
            "BIS knowledge base is loaded and ready."
            if rag_ready
            else "RAG knowledge base not initialised. Run: python -m rag.ingest"
        ),
        "llm_provider": os.getenv("LLM_PROVIDER", "gemini"),
        "embedding_model": os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2"),
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    RAG-powered BIS assistant endpoint.
    Retrieves relevant BIS knowledge chunks and generates a grounded LLM response.
    """
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    if len(request.query) > 2000:
        raise HTTPException(status_code=400, detail="Query too long (max 2000 characters).")

    try:
        result = await run_pipeline(
            query=request.query.strip(),
            top_k=min(request.top_k, 10),
            language=request.language or "en",
        )

        return ChatResponse(
            answer=result["answer"],
            sources=[SourceItem(**s) for s in result["sources"]],
            standards=[StandardRef(**s) for s in result["standards"]],
            ready=result["ready"],
            chunks_retrieved=result.get("chunks_retrieved"),
        )

    except ValueError as e:
        # LLM config error (missing API key, etc.)
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )


@app.get("/api/standards")
async def get_standards(
    q: str | None = Query(None, description="Search query"),
    mandatory: bool | None = Query(None, description="Filter to mandatory-only standards"),
    division: str | None = Query(None, description="Filter by BIS division (e.g. ETD, MTD, FAD)"),
    limit: int = Query(20, le=100, description="Max results to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
) -> dict[str, Any]:
    """
    Structured standards search endpoint.
    Returns real IS numbers from the standards catalog with optional filtering.
    """
    if not STANDARDS_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail="Standards catalog not found. Ensure backend/data/standards_catalog.json exists."
        )

    standards: list[dict] = json.loads(STANDARDS_PATH.read_text())

    # Apply filters
    if mandatory is not None:
        standards = [s for s in standards if s.get("mandatory") == mandatory]

    if division:
        standards = [
            s for s in standards
            if s.get("division", "").upper() == division.upper()
        ]

    if q:
        q_lower = q.lower()
        standards = [
            s for s in standards
            if (
                q_lower in s.get("title", "").lower()
                or q_lower in s.get("number", "").lower()
                or q_lower in s.get("scope", "").lower()
                or any(q_lower in tag.lower() for tag in s.get("tags", []))
            )
        ]

    total = len(standards)
    paginated = standards[offset : offset + limit]

    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "results": paginated,
    }


@app.get("/api/standards/{standard_id}")
async def get_standard_by_id(standard_id: str) -> dict:
    """Get a specific standard by its ID."""
    if not STANDARDS_PATH.exists():
        raise HTTPException(status_code=503, detail="Standards catalog not available.")

    standards: list[dict] = json.loads(STANDARDS_PATH.read_text())
    for std in standards:
        if std.get("id") == standard_id:
            return std

    raise HTTPException(status_code=404, detail=f"Standard '{standard_id}' not found.")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8001"))
    print(f"Starting BIS Assistant backend server on port {port}...")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
