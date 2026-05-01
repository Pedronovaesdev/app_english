"""Legendas via youtube-transcript-api (evita CORS no browser)."""

import asyncio
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    InvalidVideoId,
    IpBlocked,
    NoTranscriptFound,
    PoTokenRequired,
    RequestBlocked,
    TranscriptsDisabled,
    VideoUnavailable,
)

router = APIRouter(prefix="/api/youtube", tags=["youtube"])


def _fetch_transcript_sync(video_id: str, lang: str) -> dict[str, Any]:
    langs: list[str] = []
    for code in (lang, "en", "pt"):
        if code and code not in langs:
            langs.append(code)

    try:
        ft = YouTubeTranscriptApi().fetch(video_id, languages=langs)
    except InvalidVideoId as e:
        raise HTTPException(status_code=400, detail="ID de vídeo inválido.") from e
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        raise HTTPException(
            status_code=404,
            detail="Este vídeo não tem legendas disponíveis no idioma pedido.",
        ) from e
    except (VideoUnavailable, IpBlocked, RequestBlocked, PoTokenRequired) as e:
        raise HTTPException(
            status_code=502,
            detail="O YouTube bloqueou ou exigiu token extra para a transcrição. Tenta outro vídeo ou usa as CC no reprodutor.",
        ) from e
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=f"Falha ao obter legendas: {e!s}") from e

    return {
        "video_id": ft.video_id,
        "language_code": ft.language_code,
        "is_generated": ft.is_generated,
        "lines": ft.to_raw_data(),
    }


@router.get("/transcript")
async def get_transcript(
    video_id: str = Query(..., min_length=6, max_length=32, description="ID do vídeo (não URL completa)"),
    lang: str = Query("en", min_length=2, max_length=10, description="Código ISO preferido, com fallback en/pt"),
) -> dict[str, Any]:
    """Devolve linhas com `text`, `start` e `duration` (segundos) para mostrar abaixo do player."""
    return await asyncio.to_thread(_fetch_transcript_sync, video_id, lang)
