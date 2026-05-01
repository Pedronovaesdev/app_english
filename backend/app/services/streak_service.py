"""Streak (fogo), XP multiplier, and user progress."""

from datetime import date

from sqlmodel import Session

from app.models import ActivityLog, StreakState, UserProgress


def _get_or_create_streak(session: Session) -> StreakState:
    row = session.get(StreakState, 1)
    if row is None:
        row = StreakState(id=1)
        session.add(row)
        session.commit()
        session.refresh(row)
    return row


def _get_or_create_progress(session: Session) -> UserProgress:
    row = session.get(UserProgress, 1)
    if row is None:
        row = UserProgress(id=1)
        session.add(row)
        session.commit()
        session.refresh(row)
    return row


def record_activity_day(session: Session, activity_date: date) -> StreakState:
    """
    Register that the user was active on `activity_date` (local calendar day).
    Missing a calendar day resets `xp_multiplier` to 1.0 per product rule.
    """
    streak = _get_or_create_streak(session)
    last = streak.last_activity_date

    if last == activity_date:
        session.add(streak)
        session.commit()
        session.refresh(streak)
        return streak

    if last is None:
        streak.current_streak = 1
        streak.xp_multiplier = 1.0
    else:
        gap = (activity_date - last).days
        if gap == 1:
            streak.current_streak += 1
            streak.longest_streak = max(streak.longest_streak, streak.current_streak)
            streak.xp_multiplier = min(2.0, 1.0 + streak.current_streak * 0.05)
        elif gap > 1:
            streak.current_streak = 1
            streak.xp_multiplier = 1.0

    streak.last_activity_date = activity_date
    session.add(streak)
    session.commit()
    session.refresh(streak)
    return streak


def add_xp(session: Session, base_xp: int) -> UserProgress:
    """Apply XP with current streak multiplier."""
    streak = _get_or_create_streak(session)
    progress = _get_or_create_progress(session)
    gained = int(round(base_xp * streak.xp_multiplier))
    progress.total_xp += max(0, gained)
    progress.level = max(1, 1 + progress.total_xp // 500)
    session.add(progress)
    session.commit()
    session.refresh(progress)
    return progress


def log_activity(
    session: Session,
    activity_type: str,
    duration_seconds: int = 0,
    meta: dict | None = None,
) -> ActivityLog:
    log = ActivityLog(activity_type=activity_type, duration_seconds=duration_seconds, meta=meta)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


def get_streak_snapshot(session: Session) -> tuple[StreakState, UserProgress]:
    return _get_or_create_streak(session), _get_or_create_progress(session)


def due_streak_maintenance(session: Session, today: date) -> StreakState | None:
    """
    Optional: if user opens app after missing days without 'ping', reset multiplier.
    Call with today; if last_activity < today-1, reset multiplier and streak continuation.
    """
    streak = _get_or_create_streak(session)
    last = streak.last_activity_date
    if last is None:
        return None
    if (today - last).days > 1:
        streak.xp_multiplier = 1.0
        streak.current_streak = 0
        session.add(streak)
        session.commit()
        session.refresh(streak)
        return streak
    return None
