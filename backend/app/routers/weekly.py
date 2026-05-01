from datetime import date

from fastapi import APIRouter

from app.schemas import WeeklyTodayResponse
from app.services.weekly_cycle import (
    SATURDAY_BLOCKS,
    CyclePhase,
    cycle_phase_for_date,
    daily_target_minutes,
)

router = APIRouter(prefix="/api/weekly", tags=["weekly"])


@router.get("/today", response_model=WeeklyTodayResponse)
async def weekly_today(d: date | None = None) -> WeeklyTodayResponse:
    today = d or date.today()
    phase = cycle_phase_for_date(today)
    target = daily_target_minutes(phase)
    blocks = list(SATURDAY_BLOCKS) if phase == CyclePhase.SATURDAY_GOLD else []
    return WeeklyTodayResponse(
        date=today,
        phase=phase.value,
        daily_target_minutes=target,
        saturday_blocks=blocks,
    )
