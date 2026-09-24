'use client';

import { useMemo } from 'react';
import { formatExact } from '../lib/format';

const LANE_HEIGHT = 58;
const MIN_BLOCK_WIDTH = 64;

// Greedily assign clusters to lanes so overlapping time ranges don't collide.
function assignLanes(entries) {
  const lanes = []; // each entry: last end time (ms) occupied in that lane
  return entries.map((entry) => {
    let laneIndex = lanes.findIndex((laneEnd) => entry.startMs >= laneEnd);
    if (laneIndex === -1) {
      laneIndex = lanes.length;
      lanes.push(entry.endMs);
    } else {
      lanes[laneIndex] = entry.endMs;
    }
    return { ...entry, lane: laneIndex };
  });
}

export default function Timeline({ entries, onSelect, selectedId }) {
  const { positioned, domain, laneCount } = useMemo(() => {
    const withMs = entries
      .filter((e) => e.start)
      .map((e) => {
        const startMs = new Date(e.start).getTime();
        const endMs = e.end ? new Date(e.end).getTime() : startMs;
        return { ...e, startMs, endMs: Math.max(endMs, startMs) };
      })
      .sort((a, b) => a.startMs - b.startMs);

    if (withMs.length === 0) {
      return { positioned: [], domain: null, laneCount: 0 };
    }

    const min = Math.min(...withMs.map((e) => e.startMs));
    const max = Math.max(...withMs.map((e) => e.endMs));
    const span = Math.max(max - min, 1000 * 60 * 60); // at least 1hr span

    const withLanes = assignLanes(withMs);
    const lanes = Math.max(...withLanes.map((e) => e.lane)) + 1;

    return { positioned: withLanes, domain: { min, max: min + span }, laneCount: lanes };
  }, [entries]);

  if (positioned.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-wire-line bg-wire-panel text-wire-dim">
        <p className="font-serif text-lg text-wire-ink">No clusters in this window</p>
        <p className="text-sm">Try including more sources, or refresh to pull new articles.</p>
      </div>
    );
  }

  const maxCount = Math.max(...positioned.map((e) => e.count || 1));

  return (
    <div className="rounded-lg border border-wire-line bg-wire-panel">
      <div className="flex items-center justify-between border-b border-wire-line px-4 py-3 text-xs text-wire-dim">
        <span>{formatExact(new Date(domain.min).toISOString())}</span>
        <span>Active window</span>
        <span>{formatExact(new Date(domain.max).toISOString())}</span>
      </div>
      <div
        className="relative overflow-x-auto px-4 py-5"
        style={{ height: laneCount * LANE_HEIGHT + 24 }}
      >
        <div className="relative" style={{ minWidth: 720, height: laneCount * LANE_HEIGHT }}>
          {positioned.map((entry) => {
            const leftPct = ((entry.startMs - domain.min) / (domain.max - domain.min)) * 100;
            const widthPct = Math.max(
              ((entry.endMs - entry.startMs) / (domain.max - domain.min)) * 100,
              2
            );
            const intensity = (entry.count || 1) / maxCount;
            const isSelected = selectedId === entry.id;

            return (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className={`group absolute flex flex-col justify-center rounded-md border px-3 py-1.5 text-left transition-colors ${
                  isSelected
                    ? 'border-wire-amber bg-wire-amber/20'
                    : 'border-wire-line bg-wire-card hover:border-wire-teal/60 hover:bg-wire-card/80'
                }`}
                style={{
                  left: `${leftPct}%`,
                  width: `max(${widthPct}%, ${MIN_BLOCK_WIDTH}px)`,
                  top: entry.lane * LANE_HEIGHT,
                  height: LANE_HEIGHT - 12,
                  opacity: 0.55 + intensity * 0.45,
                }}
                title={entry.label}
              >
                <span className="truncate font-serif text-sm text-wire-ink">{entry.label}</span>
                <span className="text-[11px] text-wire-dim">
                  {entry.count} article{entry.count === 1 ? '' : 's'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
