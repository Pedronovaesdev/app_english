from fastapi import APIRouter

from app.deps import SessionDep
from app.models import ActivityLog
from app.schemas import ActivityCreate, ActivityRead
from app.services import streak_service

router = APIRouter(prefix="/api/activities", tags=["activities"])


@router.get("", response_model=list[ActivityRead])
async def list_activities(session: SessionDep, limit: int = 100) -> list[ActivityLog]:
    from sqlmodel import select

    stmt = select(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit)
    return list(session.exec(stmt).all())


@router.post("", response_model=ActivityRead)
async def create_activity(session: SessionDep, body: ActivityCreate) -> ActivityLog:
    return streak_service.log_activity(
        session,
        body.activity_type,
        duration_seconds=body.duration_seconds,
        meta=body.meta,
    )
