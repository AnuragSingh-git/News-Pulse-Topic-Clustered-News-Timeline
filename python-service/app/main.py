from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .news_fetcher import fetch_news
from .clustering import create_clusters
from .naming import get_cluster_name


app = FastAPI(
    title="News Clustering API",
    description="News clustering without AI models",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://news-pulse-topic-clustered-news-tim-ruby.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


RSS_FEEDS = [
    "https://feeds.bbci.co.uk/news/rss.xml",
    "https://feeds.skynews.com/feeds/rss/home.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
]


@app.get("/")
def home():
    return {
        "message": "News Clustering API is running"
    }


@app.get("/news")
def get_news():
    articles = []
    for feed in RSS_FEEDS:
        articles.extend(fetch_news(feed))
    return {
        "count": len(articles),
        "articles": articles,
    }


@app.get("/clusters")
def get_clusters():
    articles = []
    for feed in RSS_FEEDS:
        articles.extend(fetch_news(feed))

    clusters = create_clusters(
        articles,
        threshold=0.15,
    )

    for cluster in clusters:
        cluster["name"] = get_cluster_name(
            cluster["articles"]
        )

    return {
        "count": len(clusters),
        "clusters": clusters,
    }
