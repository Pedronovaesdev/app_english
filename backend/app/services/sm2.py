"""SuperMemo SM-2 interval scheduling (Anki-compatible core)."""

from datetime import datetime, timedelta

from app.models import FlashCard


def apply_review(card: FlashCard, quality: int, reviewed_at: datetime | None = None) -> FlashCard:
    """
    Update card fields after a review. `quality` is 0–5 (SM-2 grade).
    """
    now = reviewed_at or datetime.utcnow()
    q = max(0, min(5, quality))

    if q < 3:
        card.repetitions = 0
        card.interval_days = 1.0
    else:
        if card.repetitions == 0:
            card.interval_days = 1.0
        elif card.repetitions == 1:
            card.interval_days = 6.0
        else:
            card.interval_days = max(1.0, round(card.interval_days * card.ease_factor))

        card.repetitions += 1
        delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
        card.ease_factor = max(1.3, card.ease_factor + delta)

    card.last_reviewed_at = now
    card.next_review_at = now + timedelta(days=float(card.interval_days))
    return card
