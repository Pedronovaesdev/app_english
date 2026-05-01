"""Weekly study cycle (Speed Up): Sun–Thu base, Fri prep, Sat 60 min gold."""

from datetime import date
from enum import Enum

from pydantic import BaseModel


class CyclePhase(str, Enum):
    BASE_SUN_THU = "base_sun_thu"
    FRIDAY_PREP = "friday_prep"
    SATURDAY_GOLD = "saturday_gold"


class SaturdayBlock(BaseModel):
    key: str
    label: str
    duration_minutes: int


SATURDAY_BLOCKS: list[SaturdayBlock] = [
    SaturdayBlock(key="warmup", label="Warm-up", duration_minutes=10),
    SaturdayBlock(key="active_practice", label="Active Practice", duration_minutes=20),
    SaturdayBlock(key="games", label="Games", duration_minutes=20),
    SaturdayBlock(key="mission", label="Mission", duration_minutes=10),
]


def cycle_phase_for_date(d: date) -> CyclePhase:
    # Monday=0 … Sunday=6
    wd = d.weekday()
    if wd in (6, 0, 1, 2, 3):
        return CyclePhase.BASE_SUN_THU
    if wd == 4:
        return CyclePhase.FRIDAY_PREP
    if wd == 5:
        return CyclePhase.SATURDAY_GOLD
    return CyclePhase.BASE_SUN_THU


def daily_target_minutes(phase: CyclePhase) -> int:
    if phase == CyclePhase.BASE_SUN_THU:
        return 15
    if phase == CyclePhase.FRIDAY_PREP:
        return 15
    if phase == CyclePhase.SATURDAY_GOLD:
        return 60
    return 15


def saturday_total_minutes() -> int:
    return sum(b.duration_minutes for b in SATURDAY_BLOCKS)
