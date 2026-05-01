from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.services.weekly_cycle import SaturdayBlock


class FlashCardCreate(BaseModel):
    front: str
    back: str
    audio_path: Optional[str] = None
    source: Optional[str] = None


class FlashCardRead(BaseModel):
    id: int
    front: str
    back: str
    audio_path: Optional[str] = None
    source: Optional[str] = None
    ease_factor: float
    interval_days: float
    repetitions: int
    next_review_at: datetime
    last_reviewed_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ReviewBody(BaseModel):
    quality: int = Field(ge=0, le=5)


class StreakRead(BaseModel):
    current_streak: int
    longest_streak: int
    last_activity_date: Optional[date] = None
    xp_multiplier: float


class ProgressRead(BaseModel):
    total_xp: int
    level: int


class StreakBundle(BaseModel):
    streak: StreakRead
    progress: ProgressRead


class PingBody(BaseModel):
    activity_date: Optional[date] = None


class ActivityCreate(BaseModel):
    activity_type: str
    duration_seconds: int = 0
    meta: Optional[dict] = None


class ActivityRead(BaseModel):
    id: int
    activity_type: str
    duration_seconds: int
    meta: Optional[dict] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class WeeklyTodayResponse(BaseModel):
    date: date
    phase: str
    daily_target_minutes: int
    saturday_blocks: list[SaturdayBlock] = Field(default_factory=list)


class ArticleImportBody(BaseModel):
    """Frases/palavras marcadas pelo utilizador → flashcards."""

    phrases: list[str] = Field(..., min_length=1)
    source: str = "article"


class ArticleImportResult(BaseModel):
    created_ids: list[int]
