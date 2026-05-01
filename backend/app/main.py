from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.config import CHECKPOINTS_DIR, UPLOADS_AUDIO_DIR
from app.db import engine, init_db
from app.models import FlashCard
from app.routers import activities, articles, cards, checkpoints, streak, weekly, youtube_transcript


@asynccontextmanager
async def lifespan(_app: FastAPI):
    DATA_PARENT = CHECKPOINTS_DIR.parent
    DATA_PARENT.mkdir(parents=True, exist_ok=True)
    CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    init_db()
    with Session(engine) as session:
        if session.exec(select(FlashCard)).first() is None:
            session.add(
                FlashCard(
                    front="backwardation",
                    back="curva a termo invertida (petróleo / commodities)",
                    source="seed",
                    next_review_at=datetime.utcnow(),
                )
            )
            session.commit()
    yield


app = FastAPI(title="English Mastery OS API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cards.router)
app.include_router(streak.router)
app.include_router(activities.router)
app.include_router(weekly.router)
app.include_router(articles.router)
app.include_router(checkpoints.router)
app.include_router(youtube_transcript.router)


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
