from functools import lru_cache

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.config.settings import get_settings


@lru_cache
def get_mongo_client() -> MongoClient:
    settings = get_settings()
    mongo_url = settings["mongo_url"]
    if not mongo_url:
        raise RuntimeError("MongoDB connection string is not configured.")

    return MongoClient(mongo_url, serverSelectionTimeoutMS=5000)


def get_results_collection():
    settings = get_settings()
    client = get_mongo_client()
    return client[settings["db_name"]][settings["collection_name"]]


def get_database_status() -> dict[str, str]:
    settings = get_settings()

    if not settings["mongo_url"]:
        return {"status": "not_configured"}

    try:
        get_mongo_client().admin.command("ping")
        return {"status": "connected"}
    except (PyMongoError, RuntimeError):
        return {"status": "unreachable"}
