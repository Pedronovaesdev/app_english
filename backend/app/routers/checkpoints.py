import uuid
from datetime import date, datetime
from pathlib import Path

from fastapi import APIRouter, File, Form, UploadFile

from app.config import CHECKPOINTS_DIR, DATA_DIR
from app.deps import SessionDep
from app.models import WeeklyCheckpoint

router = APIRouter(prefix="/api/checkpoints", tags=["checkpoints"])


@router.post("/upload")
async def upload_checkpoint_audio(
    session: SessionDep,
    week_start: date = Form(),
    file: UploadFile = File(...),
) -> dict:
    """Gravação local para check-point semanal; desbloqueia missão de sábado no modelo."""
    CHECKPOINTS_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    filename = f"{week_start.isoformat()}_{uuid.uuid4().hex}{suffix}"
    dest = CHECKPOINTS_DIR / filename
    dest.write_bytes(await file.read())
    rel = str(dest.relative_to(DATA_DIR))
    row = WeeklyCheckpoint(
        week_start=week_start,
        audio_relative_path=rel,
        submitted_at=datetime.utcnow(),
        mission_unlocked=True,
    )
    session.add(row)
    session.commit()
    session.refresh(row)
    return {"id": row.id, "audio_relative_path": rel, "mission_unlocked": row.mission_unlocked}
