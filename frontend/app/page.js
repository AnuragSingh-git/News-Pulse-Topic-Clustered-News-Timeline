'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Timeline from '../components/Timeline';
import ClusterDetail from '../components/ClusterDetail';
import SourceFilter from '../components/SourceFilter';
import RefreshButton from '../components/RefreshButton';
import { fetchTimeline, fetchClusterDetail } from '../lib/api';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [activeSources, setActiveSources] = useState(new Set());
  const [sourcesInitialized, setSourcesInitialized] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [clusterDetail, setClusterDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const loadTimeline = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchTimeline();
      setEntries(data);

      if (!sourcesInitialized) {
        const allSources = new Set();
        data.forEach((entry) => (entry.sources || []).forEach((s) => allSources.add(s)));
        setActiveSources(allSources);
        setSourcesInitialized(true);
      }
    } catch (err) {
      setLoadError(err.message || 'Could not load the timeline.');
    } finally {
      setLoading(false);
    }
  }, [sourcesInitialized]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  const allSources = useMemo(() => {
    const set = new Set();
    entries.forEach((entry) => (entry.sources || []).forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!allSources.length) return entries; // backend doesn't expose per-cluster sources
    return entries.filter((entry) => {
      const entrySources = entry.sources?.length ? entry.sources : allSources;
      return entrySources.some((s) => activeSources.has(s));
    });
  }, [entries, activeSources, allSources]);

  function toggleSource(source) {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }

  async function handleSelect(entry) {
    setSelectedId(entry.id);
    setDetailLoading(true);
    setDetailError('');
    setClusterDetail(null);
    try {
      const detail = await fetchClusterDetail(entry.id);
      setClusterDetail(detail);
    } catch (err) {
      setDetailError(err.message || 'Could not load this cluster.');
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setSelectedId(null);
    setClusterDetail(null);
    setDetailError('');
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <header className="mb-8 flex flex-col gap-6 border-b border-wire-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-wire-dim">News Pulse</p>
          <h1 className="mt-1 font-serif text-4xl text-wire-ink">Topic-clustered news timeline</h1>
        </div>
        <RefreshButton onComplete={loadTimeline} />
      </header>

      <div className="mb-6">
        <SourceFilter sources={allSources} activeSources={activeSources} onToggle={toggleSource} />
      </div>

      {loading && <p className="text-wire-dim">Loading timeline…</p>}
      {loadError && !loading && (
        <div className="rounded-lg border border-wire-red/40 bg-wire-red/10 p-4 text-wire-red">
          {loadError}
        </div>
      )}

      {!loading && !loadError && (
        <Timeline entries={filteredEntries} onSelect={handleSelect} selectedId={selectedId} />
      )}

      <ClusterDetail
        cluster={clusterDetail}
        loading={detailLoading}
        error={detailError}
        onClose={closeDetail}
      />
    </main>
  );
}
