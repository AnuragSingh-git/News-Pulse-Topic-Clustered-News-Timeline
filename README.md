# 📰 News Pulse — Topic-Clustered News Timeline

**News intelligence, simplified.** News Pulse takes news articles and automatically groups similar ones into focused **story clusters**, so you can see what is happening without reading the same story again and again.

🔗 **Live demo:** [news-pulse-topic-clustered-news-tim-ruby.vercel.app](https://news-pulse-topic-clustered-news-tim-ruby.vercel.app)

---

## ✨ Features

- **Live news feed** — shows the latest articles
- **Story clustering** — similar articles are grouped into a single story
- **Biggest stories first** — clusters are ranked by how many articles cover them
- **Dashboard stats** — total stories, number of clusters, articles grouped, last refreshed time
- **Clean, responsive UI** — built for quick daily briefing

---

## 🏗️ Architecture

The project has two parts:

```
┌──────────────┐        ┌──────────────────┐
│   Frontend   │ ─────▶ │  Python Service  │
│  (Next.js)   │ ◀───── │  (clustering)    │
└──────────────┘        └──────────────────┘
```

| Part | Responsibility |
|------|----------------|
| **frontend/** | Renders the dashboard and the story clusters |
| **python-service/** | Groups similar articles using classical text-similarity technique |

### How clustering works

No AI models or LLMs are used. Clustering relies on standard text-similarity math and graph algorithms:

1. **TF-IDF** — each article's text is converted into a weighted word vector
2. **Cosine similarity** — similarity is computed between every pair of articles
3. **Graph building** — articles whose similarity crosses a threshold are connected
4. **NetworkX** — connected groups in the graph become story clusters
5. **Ranking** — clusters are sorted by size so the biggest stories appear first

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React
- **Clustering service:** Python, TF-IDF, Cosine Similarity, NetworkX
- **Deployment:** Vercel (frontend)

---

## 📁 Project Structure

```
News-Pulse-Topic-Clustered-News-Timeline/
├── frontend/           # Next.js client app
├── python-service/     # Python clustering service
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+

### 1. Clone the repository

```bash
git clone https://github.com/AnuragSingh-git/News-Pulse-Topic-Clustered-News-Timeline.git
cd News-Pulse-Topic-Clustered-News-Timeline
```

### 2. Run the Python service

```bash
cd python-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                   # or the command your service uses
```

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

> If the frontend needs the Python service URL, add it to `frontend/.env.local` (for example `NEXT_PUBLIC_API_URL=http://localhost:8000`).

---

## 🗺️ Roadmap

- [ ] Timeline view for each story cluster
- [ ] Search and filter by category
- [ ] Tune the similarity threshold for better grouping
- [ ] Caching to speed up refreshes

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 👤 Author

**Anurag Singh**

- GitHub: [@AnuragSingh-git](https://github.com/AnuragSingh-git)
- LinkedIn: [anurag-singh-98b83217a](https://linkedin.com/in/anurag-singh-98b83217a)
