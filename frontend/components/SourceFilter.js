'use client';

export default function SourceFilter({ sources, activeSources, onToggle }) {
  if (!sources.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-wire-dim mr-1">Sources</span>
      {sources.map((source) => {
        const active = activeSources.has(source);
        return (
          <button
            key={source}
            onClick={() => onToggle(source)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              active
                ? 'border-wire-teal bg-wire-teal/15 text-wire-ink'
                : 'border-wire-line text-wire-dim hover:border-wire-dim'
            }`}
          >
            {source}
          </button>
        );
      })}
    </div>
  );
}
