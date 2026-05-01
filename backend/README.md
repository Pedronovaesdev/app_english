# English Mastery OS — API

FastAPI service for flashcards, streak/XP, weekly cycle, articles import, YouTube transcript proxy, and checkpoint uploads.

## Setup

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows
pip install -e .
uvicorn app.main:app --reload --port 8000
```

- **SQLite** file: `backend/data/emastery.db` (created on first run; not versioned).
- **Interactive docs:** http://127.0.0.1:8000/docs

See the [root README](../README.md) for the full stack, frontend, and contribution guidelines.
