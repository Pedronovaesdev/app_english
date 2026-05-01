from datetime import date

from fastapi import APIRouter

from app.deps import SessionDep
from app.schemas import PingBody, StreakBundle, StreakRead, ProgressRead
from app.services import streak_service

router = APIRouter(prefix="/api/streak", tags=["streak"])


@router.get("", response_model=StreakBundle)
async def get_streak(session: SessionDep) -> StreakBundle:
    streak_service.due_streak_maintenance(session, date.today())
    streak, progress = streak_service.get_streak_snapshot(session)
    return StreakBundle(
        streak=StreakRead.model_validate(streak),
        progress=ProgressRead.model_validate(progress),
    )


@router.post("/ping", response_model=StreakBundle)
async def ping_streak(session: SessionDep, body: PingBody | None = None) -> StreakBundle:
    d = body.activity_date if body and body.activity_date else date.today()
    streak_service.record_activity_day(session, d)
    streak, progress = streak_service.get_streak_snapshot(session)
    return StreakBundle(
        streak=StreakRead.model_validate(streak),
        progress=ProgressRead.model_validate(progress),
    )
