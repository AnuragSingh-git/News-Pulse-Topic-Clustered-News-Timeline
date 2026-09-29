import re

import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def create_clusters(articles, threshold=0.15):
    if not articles:
        return []

    texts = [
        clean_text(article["title"] + " " + article.get("description", ""))
        for article in articles
    ]

    vectorizer = TfidfVectorizer(stop_words="english")

    try:
        vectors = vectorizer.fit_transform(texts)
    except ValueError:
        # No usable vocabulary: return every article as its own cluster
        return [
            {"id": i, "articles": [article]}
            for i, article in enumerate(articles)
        ]

    similarity_matrix = cosine_similarity(vectors)

    graph = nx.Graph()

    for i in range(len(articles)):
        graph.add_node(i)

    for i in range(len(articles)):
        for j in range(i + 1, len(articles)):
            similarity = similarity_matrix[i][j]

            if similarity >= threshold:
                graph.add_edge(i, j)

    groups = list(nx.connected_components(graph))

    clusters = []

    for cluster_id, group in enumerate(groups):
        cluster_articles = [
            articles[index]
            for index in group
        ]

        clusters.append({
            "id": cluster_id,
            "articles": cluster_articles,
        })

    return clusters