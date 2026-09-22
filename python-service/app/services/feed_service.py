import feedparser
import requests
import trafilatura

FEEDS = [
    "https://feeds.bbci.co.uk/news/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    "https://www.theguardian.com/world/rss",
]


def fetch_articles():
    articles = []

    for feed_url in FEEDS:
        try:
            feed = feedparser.parse(feed_url)

            for item in feed.entries:
                url = item.get("link", "")
                title = item.get("title", "")

                if not url or not title:
                    continue

                summary = item.get("summary", "")
                published = item.get("published", "")
                body = extract_body(url)

                articles.append({
                    "title": title,
                    "summary": summary,
                    "body": body,
                    "url": url,
                    "published": published,
                    "source": feed_url,
                })

        except Exception as exc:
            print(f"Feed failed: {feed_url} -> {exc}")

    return deduplicate(articles)


def extract_body(url: str) -> str:
    try:
        response = requests.get(
            url,
            timeout=10,
            headers={"User-Agent": "NewsPulse/1.0"},
        )
        return trafilatura.extract(response.text) or ""
    except Exception as exc:
        print(f"Article extraction failed: {url} -> {exc}")
        return ""


def deduplicate(articles: list[dict]) -> list[dict]:
    seen = set()
    result = []

    for article in articles:
        url = article["url"]

        if url in seen:
            continue

        seen.add(url)
        result.append(article)

    return result
