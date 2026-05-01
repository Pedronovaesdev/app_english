from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATABASE_URL = f"sqlite:///{DATA_DIR / 'emastery.db'}"

CHECKPOINTS_DIR = DATA_DIR / "checkpoints"
UPLOADS_AUDIO_DIR = DATA_DIR / "uploads" / "audio"
