from datetime import datetime

from fastapi import APIRouter

from app.deps import SessionDep
from app.models import FlashCard
from app.schemas import ArticleImportBody, ArticleImportResult

router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.post("/import", response_model=ArticleImportResult)
async def import_phrases(session: SessionDep, body: ArticleImportBody) -> ArticleImportResult:
    """Cria flashcards a partir de itens (palavra + contexto) ou frases em bruto (legado)."""
    created: list[int] = []
    if body.items:
        for item in body.items:
            card = FlashCard(
                front=item.word,
                back=item.context,
                source=body.source,
                next_review_at=datetime.utcnow(),
            )
            session.add(card)
            session.commit()
            session.refresh(card)
            created.append(card.id)
    elif body.phrases:
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
