from datetime import datetime

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.deps import SessionDep
from app.models import FlashCard
from app.schemas import FlashCardCreate, FlashCardRead, ReviewBody
from app.services import sm2, streak_service

router = APIRouter(prefix="/api/cards", tags=["cards"])


@router.get("/due", response_model=list[FlashCardRead])
async def list_due(session: SessionDep) -> list[FlashCard]:
    now = datetime.utcnow()
    stmt = select(FlashCard).where(FlashCard.next_review_at <= now).order_by(FlashCard.next_review_at)
    return list(session.exec(stmt).all())


@router.get("", response_model=list[FlashCardRead])
async def list_cards(session: SessionDep, limit: int = 200) -> list[FlashCard]:
    stmt = select(FlashCard).order_by(FlashCard.id.desc()).limit(limit)
    return list(session.exec(stmt).all())


@router.post("", response_model=FlashCardRead)
async def create_card(session: SessionDep, body: FlashCardCreate) -> FlashCard:
    card = FlashCard(
        front=body.front,
        back=body.back,
        audio_path=body.audio_path,
        source=body.source,
        next_review_at=datetime.utcnow(),
    )
    session.add(card)
    session.commit()
    session.refresh(card)
    return card


@router.post("/{card_id}/review", response_model=FlashCardRead)
async def review_card(session: SessionDep, card_id: int, body: ReviewBody) -> FlashCard:
    card = session.get(FlashCard, card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    sm2.apply_review(card, body.quality)
    session.add(card)
    session.commit()
    session.refresh(card)
    streak_service.record_activity_day(session, datetime.utcnow().date())
    streak_service.log_activity(
        session,
        "flashcard_review",
        duration_seconds=0,
        meta={"card_id": card_id, "quality": body.quality},
    )
    streak_service.add_xp(session, base_xp=10)
    return card
