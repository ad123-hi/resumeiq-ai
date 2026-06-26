import os
from functools import lru_cache

from dotenv import load_dotenv


load_dotenv()


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


@lru_cache
def get_settings() -> dict[str, str | list[str]]:
    mongo_url = os.getenv("MONGO_URL") or os.getenv("MONGO_URI", "")
    db_name = os.getenv("MONGO_DB_NAME", "resumeiq")
    collection_name = os.getenv("MONGO_COLLECTION_NAME", "results")
    cors_origins = _split_csv(os.getenv("CORS_ORIGINS"))

    return {
        "mongo_url": mongo_url,
        "db_name": db_name,
        "collection_name": collection_name,
        "cors_origins": cors_origins,
    }
