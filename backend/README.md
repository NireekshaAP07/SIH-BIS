# BIS Assistant Backend

## Quick Start

### 1. Setup Python Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and set:
#   LLM_PROVIDER=gemini         (or openai / ollama)
#   GEMINI_API_KEY=your_key     (if using Gemini)
#   OPENAI_API_KEY=your_key     (if using OpenAI)
```

### 3. Ingest the BIS Knowledge Base

This populates ChromaDB with real BIS documents. Run once (or after updating data files):

```bash
python -m rag.ingest
```

Expected output:
```
[BIS Ingest] Initialising ChromaDB at: ./chroma_db
[BIS Ingest] Loading embedding model: all-MiniLM-L6-v2
[BIS Ingest] Loaded 20 standard chunks from standards_catalog.json
[BIS Ingest] Loaded 45 chunks from certification_schemes.md
[BIS Ingest] Loaded 38 chunks from qco_reference.md
[BIS Ingest] Loaded 32 chunks from testing_labs.md
[BIS Ingest] ✅ Done — 135 chunks in ChromaDB
```

### 4. Start the Backend Server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- `GET  http://localhost:8000/api/status`    — Health check
- `POST http://localhost:8000/api/chat`      — RAG-powered BIS assistant
- `GET  http://localhost:8000/api/standards` — Standards search
- `GET  http://localhost:8000/docs`          — Swagger UI

---

## API Reference

### POST /api/chat

**Request:**
```json
{
  "query": "Which standard applies to LED lamps for CRS registration?",
  "top_k": 5
}
```

**Response:**
```json
{
  "answer": "For LED lamps, IS 15885 (Part 2/Sec 13):2012 is the applicable standard...",
  "sources": [
    {
      "title": "IS 15885 (Part 2/Sec 13):2012 — LED Lamps",
      "section": "IS 15885 (Part 2/Sec 13):2012 — ...",
      "clause": "—",
      "page": "—",
      "type": "Indian Standard (BIS Publication)",
      "relevance_score": 0.92
    }
  ],
  "standards": [
    { "number": "IS 15885 (Part 2/Sec 13):2012", "title": "LED Lamps Safety" }
  ],
  "ready": true,
  "chunks_retrieved": 5
}
```

### GET /api/standards

Query parameters:
- `q` — search text
- `mandatory` — `true` / `false`
- `division` — `ETD`, `MTD`, `FAD`, `CHD`, `CED`, `MED`
- `limit` — default 20
- `offset` — for pagination

---

## Data Files (backend/data/)

| File | Contents |
|------|----------|
| `standards_catalog.json` | 20+ real IS standards with numbers, scopes, QCO refs |
| `certification_schemes.md` | Scheme I, FMCS, CRS, Hallmarking procedures |
| `qco_reference.md` | All major active Quality Control Orders with product lists |
| `testing_labs.md` | All 6 BIS regional labs and testing procedures by category |

---

## Architecture

```
User Query (React)
      │
      ▼
POST /api/chat (FastAPI)
      │
      ├─ Retrieve: ChromaDB semantic search (top_k=5 chunks)
      │            Embedding: all-MiniLM-L6-v2 (local)
      │
      ├─ Generate: LLM (Gemini / OpenAI / Ollama)
      │            Prompt: BIS system prompt + context chunks + query
      │
      └─ Return: answer + structured sources + IS number refs
```
