from fastapi import FastAPI

from news_fetcher import fetch_news
from clustering import create_clusters
from naming import get_cluster_name


app = FastAPI(
    title="News Clustering API",
    description="News clustering without AI models",
    version="1.0",
)

RSS_FEED = "https://feeds.bbci.co.uk/news/rss.xml"


@app.get("/")
def home():
    return {
        "message": "News Clustering API is running"
    }


@app.get("/news")
def get_news():
    articles = fetch_news(RSS_FEED)

    return {
        "count": len(articles),
        "articles": articles,
    }


@app.get("/clusters")
def get_clusters():
    articles = fetch_news(RSS_FEED)

    clusters = create_clusters(
        articles,
        threshold=0.30,
    )

    for cluster in clusters:
        cluster["name"] = get_cluster_name(
            cluster["articles"]
        )

    return {
        "count": len(clusters),
        "clusters": clusters,
    }
