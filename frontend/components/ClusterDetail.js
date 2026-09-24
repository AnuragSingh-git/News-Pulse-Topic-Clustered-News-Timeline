'use client';

import { formatExact } from '../lib/format';

export default function ClusterDetail({ cluster, loading, error, onClose }) {
  const open = Boolean(cluster) || loading || error;

  return (
    <div
      className={`fixed inset-0 z-30 transition-opacity ${
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md transform overflow-y-auto border-l border-wire-line bg-wire-panel p-6 shadow-2xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="mb-4 text-sm text-wire-dim hover:text-wire-ink"
        >
          ← Back to timeline
        </button>

        {loading && <p className="text-wire-dim">Loading cluster…</p>}
        {error && <p className="text-wire-red">{error}</p>}

        {cluster && !loading && !error && (
          <>
            <h2 className="font-serif text-2xl leading-snug text-wire-ink">{cluster.label}</h2>
            <p className="mt-1 text-sm text-wire-dim">
              {cluster.articles?.length ?? cluster.articleCount} article
              {(cluster.articles?.length ?? cluster.articleCount) === 1 ? '' : 's'}
            </p>

            <ul className="mt-6 space-y-4">
              {cluster.articles?.map((article) => (
                <li key={article.id} className="border-b border-wire-line pb-4 last:border-none">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif text-base text-wire-ink hover:text-wire-teal"
                  >
                    {article.headline}
                  </a>
                  <div className="mt-1 flex items-center gap-2 text-xs text-wire-dim">
                    <span className="rounded-full border border-wire-line px-2 py-0.5">
                      {article.source}
                    </span>
                    <span>{formatExact(article.publishedAt)}</span>
                  </div>
                  {article.summary && (
                    <p className="mt-2 text-sm text-wire-dim">{article.summary}</p>
                  )}
                </li>
              ))}
              {cluster.articles?.length === 0 && (
                <li className="text-sm text-wire-dim">No articles found for this cluster.</li>
              )}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}
