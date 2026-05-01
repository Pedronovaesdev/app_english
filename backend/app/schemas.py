from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

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

    model_config = {"from_attributes": True}


class ProgressRead(BaseModel):
    total_xp: int
    level: int

    model_config = {"from_attributes": True}


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


class ArticlePhraseItem(BaseModel):
    """Palavra ou expressão + frase/verso de contexto → frente e verso do cartão."""

    model_config = ConfigDict(str_strip_whitespace=True)

    word: str = Field(..., min_length=1, description="Termo a estudar (frente do cartão)")
    context: str = Field(default="", description="Frase, verso ou contexto do artigo (verso do cartão)")


class ArticleImportBody(BaseModel):
    """Itens do artigo → flashcards. `phrases` mantém compatibilidade (uma linha = só frente)."""

    source: str = "article"
    items: list[ArticlePhraseItem] | None = None
    phrases: list[str] | None = None

    @model_validator(mode="after")
    def require_items_or_phrases(self) -> "ArticleImportBody":
        has_items = self.items is not None and len(self.items) > 0
        has_phrases = self.phrases is not None and len(self.phrases) > 0
        if not has_items and not has_phrases:
            raise ValueError("Indique items (word/context) ou phrases (legado).")
        return self


class ArticleImportResult(BaseModel):
    created_ids: list[int]
