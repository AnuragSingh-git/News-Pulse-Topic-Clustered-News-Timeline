from pymongo import MongoClient

from app.core.config import settings

_client = None


def get_database():
    global _client

    if _client is None:
        _client = MongoClient(settings.mongo_uri)

    return _client[settings.mongo_db]
