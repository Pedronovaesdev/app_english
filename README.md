# English Mastery OS

Local-first study companion for the **Speed Up / Speak Up** style routine: spaced-repetition flashcards (SM-2), streak and XP, weekly cycle (including Saturday blocks), article-to-deck import, YouTube shadowing with captions, and active-practice dialogues with optional checkpoint upload.

**Stack:** FastAPI + SQLModel (SQLite) · React (Vite) + Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Project layout](#project-layout)
- [API overview](#api-overview)
- [Privacy & local data](#privacy--local-data)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Area | What you get |
|------|----------------|
| **Flashcards** | SM-2 style review queue (`/cards`), front/back, optional audio path in schema. |
| **Gamification** | Streak, XP / level, weekly phase hints from `/weekly/today`. |
| **Articles → deck** | POST `/api/articles/import` with `items: [{ word, context }]` (or legacy `phrases: string[]`). |
| **Shadowing** | YouTube embed with 5s loop; captions loaded via `/api/youtube/transcript` and synced under the player. |
| **Active practice** | Themed dialogue blocks (travel, work, ML, software architecture, etc.) + microphone recording and optional checkpoint upload. |
| **Checkpoints** | Audio upload for weekly checkpoint (see `checkpoints` router). |

Product rules and roadmap cues live in [`.cursor/rules/english-mastery-os.mdc`](.cursor/rules/english-mastery-os.mdc).

---

## Requirements

- **Python** 3.11+
- **Node.js** 20+ (LTS recommended)

---

## Quick start

### 1. Backend API

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
# source .venv/bin/activate

pip install -e .
uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://127.0.0.1:8000/api/health`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` to `http://127.0.0.1:8000` (see `frontend/vite.config.ts`).

---

## Project layout

| Path | Role |
|------|------|
| `backend/app/` | FastAPI app: `main.py`, `models.py`, `schemas.py`, `routers/`, `services/` (SM-2, streak, weekly cycle). |
| `backend/data/` | **Not in git** — SQLite DB (`emastery.db`), checkpoints, uploads (created on first run). |
| `frontend/src/` | React routes, pages, `api/client.ts`, shared UI. |
| `frontend/src/data/` | Static dialogue content for active practice. |
| `docs/obsidian-graphs/` | Optional developer maps (wikilinks / blast radius) for Obsidian. |

---

## API overview

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Liveness. |
| `GET` / `POST` | `/api/cards`, `/api/cards/due`, `/api/cards/{id}/review` | Flashcard CRUD / SM-2 review. |
| `POST` | `/api/articles/import` | Create cards from article snippets. |
| `GET` | `/api/youtube/transcript` | Query `video_id`, optional `lang` — returns timed lines for the shadowing UI. |
| `GET` / `POST` | `/api/streak`, `/api/streak/ping` | Streak and XP bundle. |
| `GET` | `/api/weekly/today` | Weekly UI payload. |
| `POST` | `/api/checkpoints/upload` | Multipart checkpoint audio. |

OpenAPI: **http://127.0.0.1:8000/docs** when the server is running.

---

## Privacy & local data

- Your **SQLite database**, **audio checkpoints**, and any **`.env`** secrets must stay on your machine.
- Paths under `backend/data/` and patterns like `*.db` are **gitignored** — do not force-add them.
- If a database file was ever pushed to a public remote, treat it as **compromised** for sensitive content: rotate secrets, rewrite Git history or deprecate the repo, and replace the file locally.

---

## Contributing

Contributions are welcome.

1. **Fork** the repository and create a **short-lived branch** from `main`.
2. Keep commits **small and scoped** (one logical change per commit when possible). Conventional Commit prefixes help: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
3. Run **`npm run build`** in `frontend` and ensure the **backend starts** after your changes.
4. Open a **pull request** with a clear description of behaviour changes and any new env vars or dependencies.

Please avoid committing personal study exports, PDFs with private notes, or database dumps.

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).
