from app.core.database import get_database


class ClusterRepository:
    def __init__(self):
        self.collection = get_database()["clusters"]

    def replace_all(self, clusters: list[dict]):
        self.collection.delete_many({})

        if clusters:
            self.collection.insert_many(clusters)
