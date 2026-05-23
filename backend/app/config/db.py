import os
from functools import lru_cache

from dotenv import load_dotenv
from pymongo import MongoClient


DB_NAME = "resumeiq"
COLLECTION_NAME = "results"

load_dotenv()


@lru_cache
def get_mongo_client() -> MongoClient:
    mongo_url = os.getenv("MONGO_URL")
    if not mongo_url:
        raise RuntimeError("MONGO_URL is not configured.")

    return MongoClient(mongo_url, serverSelectionTimeoutMS=5000)


def get_results_collection():
    client = get_mongo_client()
    return client[DB_NAME][COLLECTION_NAME]
