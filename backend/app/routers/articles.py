from datetime import datetime

from fastapi import APIRouter

from app.deps import SessionDep
from app.models import FlashCard
from app.schemas import ArticleImportBody, ArticleImportResult

router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.post("/import", response_model=ArticleImportResult)
async def import_phrases(session: SessionDep, body: ArticleImportBody) -> ArticleImportResult:
    """Cria flashcards a partir de frases marcadas (ex.: artigos ML/Petróleo)."""
    created: list[int] = []
    for phrase in body.phrases:
        text = phrase.strip()
        if not text:
            continue
        card = FlashCard(
            front=text,
            back="",
            source=body.source,
            next_review_at=datetime.utcnow(),
        )
        session.add(card)
        session.commit()
        session.refresh(card)
        created.append(card.id)
    return ArticleImportResult(created_ids=created)
