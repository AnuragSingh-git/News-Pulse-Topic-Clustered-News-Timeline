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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getSource(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "News source";
  }
}

function cleanDescription(text: string) {
  const clean = text.replace(/<[^>]*>/g, "").trim();

  return clean.length > 170
    ? `${clean.slice(0, 170)}...`
    : clean;
}

function getClusterStyle(index: number) {
  const styles = [
    {
      icon: "bg-violet-100 text-violet-700",
      badge: "bg-violet-50 text-violet-700",
      border: "hover:border-violet-200",
    },
    {
      icon: "bg-blue-100 text-blue-700",
      badge: "bg-blue-50 text-blue-700",
      border: "hover:border-blue-200",
    },
    {
      icon: "bg-emerald-100 text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700",
      border: "hover:border-emerald-200",
    },
    {
      icon: "bg-orange-100 text-orange-700",
      badge: "bg-orange-50 text-orange-700",
      border: "hover:border-orange-200",
    },
    {
      icon: "bg-fuchsia-100 text-fuchsia-700",
      badge: "bg-fuchsia-50 text-fuchsia-700",
      border: "hover:border-fuchsia-200",
    },
  ];

  return styles[index % styles.length];
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

      const response = await fetch(`${API_URL}/clusters`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch clusters");
      }

      const data = await response.json();

      setClusters(data.clusters || []);

      setUpdatedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    } catch (err) {
      console.error(err);

      setError(
        `Could not connect to the FastAPI backend at ${API_URL}`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClusters();
  }, []);

  const totalArticles = useMemo(
    () =>
      clusters.reduce(
        (total, cluster) =>
          total + cluster.articles.length,
        0
      ),
    [clusters]
  );

  /*
   * IMPORTANT:
   * Sort clusters by article count.
   * Largest cluster appears first.
   */
  const sortedClusters = useMemo(() => {
    return [...clusters].sort(
      (a, b) =>
        b.articles.length - a.articles.length
    );
  }, [clusters]);

  const visibleClusters = useMemo(() => {
    const query = search.toLowerCase().trim();

    return sortedClusters
      .filter(
        (cluster) =>
          selectedCluster === "all" ||
          cluster.id.toString() === selectedCluster
      )
      .map((cluster) => ({
        ...cluster,

        articles: cluster.articles.filter(
          (article) => {
            if (!query) return true;

            return (
              article.title
                .toLowerCase()
                .includes(query) ||
              article.description
                ?.toLowerCase()
                .includes(query) ||
              cluster.name
                .toLowerCase()
                .includes(query)
            );
          }
        ),
      }))
      .filter(
        (cluster) =>
          cluster.articles.length > 0
      );
  }, [
    sortedClusters,
    search,
    selectedCluster,
  ]);

  const largestCluster = sortedClusters[0];

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#171522]">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-130 w-130 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="absolute -left-40 top-125 h-112.5 w-112.5 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="mx-auto w-[calc(100%-32px)] max-w-345 py-6">

        {/* NAVBAR */}
        <header className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-linear-to-br from-violet-500 to-indigo-700 text-white shadow-lg shadow-violet-500/20">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Pulse
              </h2>

              <p className="text-[11px] text-[#858290]">
                News intelligence, simplified
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-full border border-[#e7e6ee] bg-white px-3 py-2 text-xs font-semibold shadow-sm sm:flex">

              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(52,180,125,.12)]" />

              Live feed
            </div>

            <button
              onClick={loadClusters}
              aria-label="Refresh news"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-[#e7e6ee] bg-white text-[#656171] shadow-sm transition hover:border-violet-200 hover:text-violet-600"
            >
              <RefreshCw
                size={18}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>

          </div>
        </header>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-4xl bg-linear-to-br from-[#18152b] via-[#282348] to-[#51459a] px-7 py-12 text-white shadow-[0_30px_80px_rgba(36,29,67,.22)] sm:px-12 sm:py-14 lg:px-16 lg:py-16">

          <div className="relative z-10 max-w-3xl">

            <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.07] px-3.5 py-2 text-xs font-semibold text-violet-200 backdrop-blur">

              <TrendingUp size={15} />

              Smart topic clustering

            </div>

            <h1 className="text-5xl font-bold leading-[0.98] tracking-[-2.5px] sm:text-6xl lg:text-[70px]">

              Everything happening,

              <br />

              <span className="text-violet-300">
                grouped by story.
              </span>

            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#c0bccd] sm:text-[15px]">

              Similar news articles are automatically
              organized into focused story clusters,
              so you can understand what is happening
              without reading the same story again and again.

            </p>

            {/* Quick numbers */}

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur">

                <span className="block text-[10px] uppercase tracking-wider text-white/50">
                  Stories
                </span>

                <strong className="mt-1 block text-xl">
                  {loading
                    ? "..."
                    : totalArticles}
                </strong>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur">

                <span className="block text-[10px] uppercase tracking-wider text-white/50">
                  Clusters
                </span>

                <strong className="mt-1 block text-xl">
                  {loading
                    ? "..."
                    : clusters.length}
                </strong>

              </div>

              {largestCluster && (
                <div className="hidden max-w-65 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur sm:block">

                  <span className="block text-[10px] uppercase tracking-wider text-white/50">
                    Biggest story
                  </span>

                  <strong className="mt-1 block truncate text-sm">
                    {largestCluster.name}
                  </strong>

                </div>
              )}

            </div>

          </div>

          {/* Decorative graphic */}

          <div className="absolute -right-17.5 top-1/2 hidden h-95 w-95 -translate-y-1/2 rounded-full border border-white/10 lg:block">

            <div className="absolute inset-8 rounded-full border border-dashed border-violet-200/10" />

            <div className="absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[38px] border border-white/15 bg-white/8 shadow-2xl backdrop-blur-xl">

              <div className="text-center">

                <Newspaper
                  size={30}
                  className="mx-auto mb-2 text-violet-300"
                />

                <strong className="block text-3xl">
                  {loading
                    ? "..."
                    : clusters.length}
                </strong>

                <span className="text-xs text-white/50">
                  story clusters
                </span>

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

        {/* SECTION HEADER */}

        <section className="mb-6 mt-14">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-violet-600">
                Today&apos;s briefing
              </div>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                What&apos;s happening
              </h2>

              <p className="mt-1 text-sm text-[#858290]">
                The biggest stories appear first.
              </p>

            </div>

            {/* Controls */}

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-[#e5e4ec] bg-white px-3 shadow-sm sm:w-72">

                <Search
                  size={17}
                  className="shrink-0 text-[#9290a0]"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search stories..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#aaa7b3]"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="cursor-pointer text-[#9290a0] hover:text-violet-600"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              <select
                value={selectedCluster}
                onChange={(e) =>
                  setSelectedCluster(
                    e.target.value
                  )
                }
                className="h-11 max-w-full rounded-xl border border-[#e5e4ec] bg-white px-3 text-xs text-[#4f4c5c] shadow-sm outline-none sm:max-w-55"
              >

                <option value="all">
                  All stories
                </option>

                {sortedClusters.map(
                  (cluster) => (
                    <option
                      key={cluster.id}
                      value={cluster.id}
                    >
                      {cluster.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5">

            <div>

              <strong className="text-sm">
                Backend connection problem
              </strong>

              <p className="mt-1 text-xs text-red-900/60">
                {error}
              </p>

            </div>

            <button
              onClick={loadClusters}
              className="cursor-pointer rounded-lg bg-[#272333] px-4 py-2 text-xs font-semibold text-white"
            >
              Try again
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="grid gap-5 md:grid-cols-2">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="min-h-[350px] animate-pulse rounded-[24px] border border-[#e7e6ee] bg-white p-6"
                >

                  <div className="h-10 w-10 rounded-xl bg-slate-200" />

                  <div className="mt-7 h-7 w-4/5 rounded bg-slate-200" />

                  <div className="mt-6 h-24 rounded-2xl bg-slate-100" />

                  <div className="mt-3 h-24 rounded-2xl bg-slate-100" />

                </div>
              )
            )}

          </div>
        )}

        {/* CLUSTERS */}

        {!loading &&
          !error &&
          visibleClusters.length > 0 && (
            <section className="grid gap-5 md:grid-cols-2">

              {visibleClusters.map(
                (cluster, index) => {

                  const style =
                    getClusterStyle(index);

                  const isFeatured =
                    index === 0 &&
                    selectedCluster === "all" &&
                    !search;

                  return (
                    <article
                      key={cluster.id}
                      className={`
                        group rounded-[24px]
                        border border-[#e5e4ed]
                        bg-white
                        p-5
                        shadow-[0_12px_40px_rgba(47,40,82,.055)]
                        transition duration-300
                        hover:-translate-y-1
                        hover:shadow-[0_22px_55px_rgba(47,40,82,.10)]
                        ${style.border}
                        ${
                          isFeatured
                            ? "md:col-span-2"
                            : ""
                        }
                      `}
                    >

                      {/* Cluster header */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-start gap-3">

                          <div
                            className={`
                              grid h-11 w-11
                              shrink-0 place-items-center
                              rounded-[14px]
                              ${style.icon}
                            `}
                          >
                            <Newspaper
                              size={19}
                            />
                          </div>

                          <div className="min-w-0">

                            <div className="mb-1 flex items-center gap-2">

                              {isFeatured && (
                                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-700">
                                  Biggest story
                                </span>
                              )}

                            </div>

                            {/* MAIN CLUSTER HEADING */}

                            <h3
                              className={`
                                font-bold leading-tight
                                tracking-tight text-[#20202a]
                                ${
                                  isFeatured
                                    ? "text-2xl sm:text-3xl"
                                    : "text-xl"
                                }
                              `}
                            >
                              {cluster.name}
                            </h3>

                          </div>

                        </div>

                        {/* Story count */}

                        <div
                          className={`
                            shrink-0 rounded-full
                            px-3 py-1.5
                            text-[10px] font-bold
                            ${style.badge}
                          `}
                        >
                          {cluster.articles.length}{" "}
                          {cluster.articles.length === 1
                            ? "story"
                            : "stories"}
                        </div>

                      </div>

                      {/* Divider */}

                      <div className="my-5 h-px bg-[#eeeef3]" />

                      {/* Articles */}

                      <div
                        className={`
                          grid gap-2
                          ${
                            isFeatured
                              ? "lg:grid-cols-2"
                              : ""
                          }
                        `}
                      >

                        {cluster.articles.map(
                          (
                            article,
                            articleIndex
                          ) => (
                            <a
                              key={`${article.url}-${articleIndex}`}
                              href={article.url}
                              target="_blank"
                              rel="noreferrer"
                              className="group/article relative grid grid-cols-[30px_1fr_18px] gap-3 rounded-[16px] border border-[#ecebf1] bg-[#fafafd] p-3.5 transition duration-200 hover:border-violet-200 hover:bg-white hover:shadow-sm"
                            >

                              {/* Article number */}

                              <div className="pt-1 text-[10px] font-bold text-[#b5b2bd]">
                                {String(
                                  articleIndex + 1
                                ).padStart(2, "0")}
                              </div>

                              <div className="min-w-0">

                                <div className="mb-1.5 flex items-center gap-1 text-[10px] font-medium text-[#8d8997]">

                                  <span>
                                    {getSource(
                                      article.url
                                    )}
                                  </span>

                                  <ExternalLink
                                    size={11}
                                  />

                                </div>

                                <h4 className="text-[13px] font-semibold leading-snug text-[#282733]">
                                  {article.title}
                                </h4>

                                {article.description && (
                                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#92909d]">
                                    {cleanDescription(
                                      article.description
                                    )}
                                  </p>
                                )}

                              </div>

                              <ArrowUpRight
                                size={17}
                                className="mt-1 text-[#aaa6b5] transition group-hover/article:-translate-y-0.5 group-hover/article:translate-x-0.5 group-hover/article:text-violet-600"
                              />

                            </a>
                          )
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </section>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          visibleClusters.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#d8d6e1] bg-white/50 text-center">

              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-500">
                <Search size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#4a4754]">
                No stories found
              </h3>

              <p className="mt-1 max-w-sm text-xs text-[#92909d]">
                Try another search term or refresh
                the news feed.
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-lg bg-[#272333] px-4 py-2 text-xs font-semibold text-white"
                >
                  Clear search
                </button>
              )}

            </div>
          )}

        {/* FOOTER */}

        <footer className="mt-14 flex flex-col gap-2 border-t border-[#e7e6ee] py-6 text-[10px] text-[#9b98a6] sm:flex-row sm:items-center sm:justify-between">

          <span>
            Pulse News Clustering
          </span>

          <span>
            TF-IDF · Cosine Similarity · NetworkX
          </span>

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
    purple:
      "bg-violet-50 text-violet-600",
    blue:
      "bg-blue-50 text-blue-600",
    green:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="flex items-center gap-3 rounded-[20px] border border-white bg-white/90 p-4 shadow-[0_15px_45px_rgba(43,36,77,.06)]">

      <div
        className={`
          grid h-10 w-10
          place-items-center
          rounded-xl
          ${colors[color]}
        `}
      >
        {icon}
      </div>

      <div>

        <span className="block text-[11px] text-[#858290]">
          {title}
        </span>

        <strong className="text-lg font-bold">
          {value}
        </strong>

      </div>

    </div>
  );
}