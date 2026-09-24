import feedparser


def fetch_news(feed_url):
    feed = feedparser.parse(feed_url)

    articles = []

    for entry in feed.entries:
        articles.append({
            "title": entry.get("title", ""),
            "url": entry.get("link", ""),
            "description": entry.get("description", ""),
        })

    return articles
