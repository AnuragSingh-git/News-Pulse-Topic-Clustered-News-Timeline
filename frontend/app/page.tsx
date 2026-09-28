"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  ExternalLink,
  LayoutGrid,
  Newspaper,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

type Article = {
  title: string;
  url: string;
  description?: string;
};

type Cluster = {
  id: number;
  name: string;
  articles: Article[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getSource(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "News source";
  }
}

function cleanDescription(text: string) {
  const clean = text.replace(/<[^>]*>/g, "").trim();
  return clean.length > 150 ? `${clean.slice(0, 150)}...` : clean;
}

export default function Home() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [updatedAt, setUpdatedAt] = useState("");

  async function loadClusters() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/clusters`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch clusters");

      const data = await response.json();
      setClusters(data.clusters || []);
      setUpdatedAt(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    } catch (err) {
      console.error(err);
      setError(`Could not connect to the FastAPI backend at ${API_URL}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClusters();
  }, []);

  const totalArticles = useMemo(
    () => clusters.reduce((total, c) => total + c.articles.length, 0),
    [clusters]
  );

  const visibleClusters = useMemo(() => {
    const query = search.toLowerCase().trim();

    return clusters
      .filter(
        (c) => selectedCluster === "all" || c.id.toString() === selectedCluster
      )
      .map((c) => ({
        ...c,
        articles: c.articles.filter((a) => {
          if (!query) return true;
          return (
            a.title.toLowerCase().includes(query) ||
            a.description?.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((c) => c.articles.length > 0);
  }, [clusters, search, selectedCluster]);

  return (
    <main className="min-h-screen bg-[#f5f6fb] text-[#171522]">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute -left-40 top-80 h-112.5 w-[450px] rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="mx-auto w-[calc(100%-32px)] max-w-[1320px] py-6">
        {/* NAVBAR */}
        <header className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-linear-to-br from-violet-400 to-violet-700 text-white shadow-lg shadow-violet-500/25">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Pulse</h2>
              <p className="text-[11px] text-[#858290]">
                News intelligence, simplified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-[#e7e6ee] bg-white/80 px-3 py-2 text-xs font-semibold sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(52,180,125,.12)]" />
              Live feed
            </div>
            <button
              onClick={loadClusters}
              aria-label="Refresh"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[#e7e6ee] bg-white text-[#656171] transition hover:text-violet-600"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        {/* HERO */}
        <section className="relative min-h-[340px] overflow-hidden rounded-[30px] bg-linear-to-br from-[#1c1930] via-[#28234a] to-[#483c88] px-7 py-12 text-white shadow-[0_25px_60px_rgba(36,29,67,.2)] sm:px-12 sm:py-14 lg:px-16">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-200">
              <TrendingUp size={15} />
              Smart topic clustering
            </div>

            <h1 className="font-display text-5xl font-bold leading-[.98] tracking-[-2px] sm:text-6xl lg:text-[68px]">
              Everything happening,
              <br />
              <span className="text-violet-300">grouped by story.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-[#b8b4c8] sm:text-[15px]">
              Similar news articles are automatically organized into focused
              story clusters, making it easier to understand what is happening
              without reading duplicate headlines.
            </p>
          </div>

          {/* Hero circle */}
          <div className="absolute -bottom-20 right-1/2 h-60 w-60 translate-x-1/2 sm:bottom-auto sm:right-[7%] sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-dashed border-violet-200/15" />
            <div className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[36px] border border-white/15 bg-white/[.08] backdrop-blur-xl">
              <div className="flex flex-col items-center">
                <Newspaper size={27} className="mb-1 text-violet-300" />
                <strong className="font-display text-2xl">
                  {loading ? "..." : clusters.length}
                </strong>
                <span className="text-[11px] text-[#a7a2b8]">topics</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <Stat
            icon={<LayoutGrid size={19} />}
            title="Story clusters"
            value={clusters.length}
            color="purple"
          />
          <Stat
            icon={<Newspaper size={19} />}
            title="Articles grouped"
            value={totalArticles}
            color="blue"
          />
          <Stat
            icon={<Clock3 size={19} />}
            title="Last refreshed"
            value={updatedAt || "—"}
            color="green"
          />
        </section>

        {/* TOOLBAR */}
        <section className="mb-5 mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[1.3px] text-violet-600">
              Today&apos;s briefing
            </div>
            <h2 className="mt-1 font-display text-3xl font-bold tracking-tight">
              Story clusters
            </h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-[#e7e6ee] bg-white px-3 text-[#9290a0] sm:w-64">
              <Search size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[#171522] outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="h-11 max-w-full rounded-xl border border-[#e7e6ee] bg-white px-3 text-xs text-[#4f4c5c] outline-none sm:max-w-[190px]"
            >
              <option value="all">All topics</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div>
              <strong className="text-sm">Backend connection problem</strong>
              <p className="mt-1 text-xs text-red-900/60">{error}</p>
            </div>
            <button
              onClick={loadClusters}
              className="cursor-pointer rounded-lg bg-[#272333] px-3 py-2 text-xs text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-h-[370px] animate-pulse rounded-[22px] border border-[#e7e6ee] bg-white p-6"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="mt-6 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-5 h-24 rounded-xl bg-slate-100" />
                <div className="mt-3 h-24 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* CLUSTERS */}
        {!loading && !error && visibleClusters.length > 0 && (
          <section className="grid gap-5 md:grid-cols-2">
            {visibleClusters.map((cluster, clusterIndex) => (
              <article
                key={cluster.id}
                className="rounded-[22px] border border-[#e5e4ed] bg-white/90 p-5 shadow-[0_12px_38px_rgba(47,40,82,.055)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(47,40,82,.09)]"
              >
                {/* Cluster header */}
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-[13px] font-display text-[11px] font-bold ${topicColor(
                      clusterIndex
                    )}`}
                  >
                    {String(clusterIndex + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-[1px] text-[#858290]">
                      Topic {String(clusterIndex + 1).padStart(2, "0")}
                    </span>
                    <strong className="text-xs">
                      {cluster.articles.length}{" "}
                      {cluster.articles.length === 1 ? "story" : "stories"}
                    </strong>
                  </div>
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold leading-tight tracking-tight">
                  {cluster.name}
                </h3>

                {/* Articles */}
                <div className="mt-5 space-y-2">
                  {cluster.articles.map((article, articleIndex) => (
                    <a
                      key={`${article.url}-${articleIndex}`}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group grid grid-cols-[26px_1fr_18px] gap-2.5 rounded-[14px] border border-[#ecebf1] bg-[#fbfbfd] p-3 transition hover:translate-x-0.5 hover:border-violet-200 hover:bg-white"
                    >
                      <div className="pt-0.5 font-display text-[10px] font-semibold text-[#b0adba]">
                        {String(articleIndex + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1.5 flex items-center gap-1 text-[10px] text-[#888594]">
                          {getSource(article.url)}
                          <ExternalLink size={12} />
                        </div>
                        <h4 className="text-[13px] font-semibold leading-snug text-[#272533]">
                          {article.title}
                        </h4>
                        {article.description && (
                          <p className="mt-1.5 text-[11px] leading-relaxed text-[#92909d]">
                            {cleanDescription(article.description)}
                          </p>
                        )}
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-[#aaa6b5] transition group-hover:text-violet-600"
                      />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* EMPTY */}
        {!loading && !error && visibleClusters.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d8d6e1] text-center text-[#aaa7b3]">
            <Newspaper size={30} />
            <h3 className="mt-4 font-display text-lg font-semibold text-[#4a4754]">
              No stories found
            </h3>
            <p className="mt-1 text-xs">
              Try another search or refresh the news feed.
            </p>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-12 flex flex-col gap-2 border-t border-[#e7e6ee] py-5 text-[10px] text-[#9b98a6] sm:flex-row sm:justify-between">
          <span>Pulse News Clustering</span>
          <span>TF-IDF · Cosine Similarity · NetworkX</span>
        </footer>
      </div>
    </main>
  );
}

function Stat({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: "purple" | "blue" | "green";
}) {
  const colors = {
    purple: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-white bg-white/85 p-4 shadow-[0_18px_55px_rgba(43,36,77,.08)]">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>
      <div>
        <span className="block text-[11px] text-[#858290]">{title}</span>
        <strong className="font-display text-lg">{value}</strong>
      </div>
    </div>
  );
}

function topicColor(index: number) {
  const colors = [
    "bg-violet-50 text-violet-600",
    "bg-blue-50 text-blue-600",
    "bg-emerald-50 text-emerald-600",
    "bg-orange-50 text-orange-600",
    "bg-fuchsia-50 text-fuchsia-600",
  ];
  return colors[index % colors.length];
}
