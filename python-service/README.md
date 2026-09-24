# News Clustering API

A beginner-friendly news clustering project using **no AI model**.

## Technologies

- Python
- FastAPI
- Uvicorn
- Feedparser
- Scikit-learn
- NetworkX
- TF-IDF
- Cosine similarity

## How it works

RSS Feed
-> fetch articles
-> TF-IDF
-> cosine similarity
-> NetworkX graph
-> connected components
-> clusters
-> representative article title as cluster name
-> FastAPI JSON API

## Setup

Create and activate a virtual environment if desired:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run

From the project root:

```bash
cd app
uvicorn main:app --reload
```

The API will run at:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs

## Endpoints

### GET /

Checks that the API is running.

### GET /news

Fetches articles from the configured RSS feed.

### GET /clusters

Fetches the RSS articles and groups similar articles into clusters.

## Important

The current cluster name is selected from the most representative existing article title. No AI/LLM is used.

The similarity threshold is currently `0.30` in `main.py`. You can experiment with this value later.
