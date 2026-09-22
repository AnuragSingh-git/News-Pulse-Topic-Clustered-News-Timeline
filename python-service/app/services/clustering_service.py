import re

STOP_WORDS = {
    "the", "a", "an", "and", "or", "of", "to", "in", "on", "for",
    "with", "is", "are", "was", "were", "as", "at", "by", "from",
    "this", "that", "new", "after", "before", "has", "have", "had",
    "will", "its", "it", "be", "into", "over", "their", "they",
}


def get_keywords(text: str) -> set[str]:
    words = re.findall(r"[a-zA-Z0-9]+", (text or "").lower())

    return {
        word
        for word in words
        if len(word) > 2 and word not in STOP_WORDS
    }


def cluster_articles(articles: list[dict], threshold: int = 2) -> list[dict]:
    clusters = []

    for article in articles:
        text = f'{article.get("title", "")} {article.get("summary", "")}'
        keywords = get_keywords(text)
        placed = False

        for cluster in clusters:
            common_words = keywords & cluster["keywords"]

            if len(common_words) >= threshold:
                cluster["articles"].append(article)
                cluster["keywords"].update(keywords)
                placed = True
                break

        if not placed:
            clusters.append({
                "keywords": keywords,
                "articles": [article],
            })

    return build_cluster_documents(clusters)


def build_cluster_documents(clusters: list[dict]) -> list[dict]:
    documents = []

    for index, cluster in enumerate(clusters, start=1):
        articles = cluster["articles"]
        times = [
            article.get("published", "")
            for article in articles
            if article.get("published")
        ]

        label_words = sorted(cluster["keywords"])[:3]
        label = " ".join(label_words) or "General News"

        documents.append({
            "clusterId": f"cluster-{index}",
            "label": label,
            "articles": articles,
            "articleCount": len(articles),
            "startTime": min(times) if times else "",
            "endTime": max(times) if times else "",
            "intensity": len(articles),
        })

    return documents
