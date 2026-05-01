# English Mastery OS

Aplicação **local-first**: FastAPI + SQLite (SM-2, streak, ciclo semanal) e React (Vite) + Tailwind (foco 15 min, missões de sábado, shadowing, active practice, importação de artigos).

## Requisitos

- Python 3.11+
- Node.js 20+ (recomendado)

## Arranque rápido

**1. API**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
uvicorn app.main:app --reload --port 8000
```

**2. Frontend** (outro terminal)

```powershell
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. O proxy encaminha `/api` para `http://127.0.0.1:8000`.

## Alinhamento ao método

Os tempos (15 min dom–qui, 60 min sábado, blocos 10/20/20/10) estão no código e na rule do projeto. Para ajustes finos, cruza com o PDF `Roteiro de Estudos - Speed Up Atualizado-1_260501_180931.pdf` na raiz do repositório.

## Estrutura

- `backend/app` — modelos SQLModel, serviços SM-2 / streak / ciclo, rotas REST.
- `frontend/src` — dashboard foco, flashcards, sábado, YouTube (loop 5s), gravação + upload de check-point, importador de frases.
