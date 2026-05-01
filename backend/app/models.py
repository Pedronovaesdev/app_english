from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column
from sqlalchemy.types import JSON
from sqlmodel import Field, SQLModel


class ActivityType(str, Enum):
    FLASHCARD_REVIEW = "flashcard_review"
    AUDIO_VIDEO_MINUTE = "audio_video_minute"
    DAILY_SESSION_15 = "daily_session_15"
    SATURDAY_BLOCK = "saturday_block"
    ARTICLE_IMPORT = "article_import"
    CHECKPOINT_AUDIO = "checkpoint_audio"


class FlashCard(SQLModel, table=True):
    __tablename__ = "flashcard"

    id: Optional[int] = Field(default=None, primary_key=True)
    front: str
    back: str
    audio_path: Optional[str] = None
    source: Optional[str] = Field(default=None, description="article|youtube|manual|…")

    ease_factor: float = Field(default=2.5, ge=1.3)
    interval_days: float = Field(default=0.0)
    repetitions: int = Field(default=0, ge=0)
    next_review_at: datetime = Field(default_factory=datetime.utcnow)
    last_reviewed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    activity_type: str
    duration_seconds: int = Field(default=0, ge=0)
    meta: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class StreakState(SQLModel, table=True):
    """Singleton row id=1 — fogo + multiplicador de XP."""

    __tablename__ = "streak_state"

    id: int = Field(default=1, primary_key=True)
    current_streak: int = Field(default=0, ge=0)
    longest_streak: int = Field(default=0, ge=0)
    last_activity_date: Optional[date] = None
    xp_multiplier: float = Field(default=1.0, ge=0.1, le=3.0)


class UserProgress(SQLModel, table=True):
    __tablename__ = "user_progress"

    id: int = Field(default=1, primary_key=True)
    total_xp: int = Field(default=0, ge=0)
    level: int = Field(default=1, ge=1)


class WeeklyCheckpoint(SQLModel, table=True):
    __tablename__ = "weekly_checkpoint"

    id: Optional[int] = Field(default=None, primary_key=True)
    week_start: date
    audio_relative_path: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    mission_unlocked: bool = Field(default=False)
