from app.repositories.cluster_repository import ClusterRepository
from app.services.clustering_service import cluster_articles
from app.services.feed_service import fetch_articles


def run_ingestion():
    articles = fetch_articles()
    clusters = cluster_articles(articles)

    ClusterRepository().replace_all(clusters)

    print(
        f"Ingestion complete: "
        f"{len(articles)} articles, {len(clusters)} clusters"
    )
