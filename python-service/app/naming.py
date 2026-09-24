from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def get_cluster_name(articles):
    if not articles:
        return "Unknown"

    if len(articles) == 1:
        return articles[0]["title"]

    titles = [article["title"] for article in articles]

    vectorizer = TfidfVectorizer(stop_words="english")
    vectors = vectorizer.fit_transform(titles)

    similarity_matrix = cosine_similarity(vectors)
    average_scores = similarity_matrix.mean(axis=1)
    best_index = average_scores.argmax()

    return titles[best_index]
