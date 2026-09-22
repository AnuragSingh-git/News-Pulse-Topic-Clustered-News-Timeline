'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, Article, Cluster } from '../lib/api';

const sourceOf = (article: Article) => article.source || 'Unknown source';
const articleUrl = (article: Article) => article.link || article.url || '#';

function formatDate(value?: string, opts: Intl.DateTimeFormatOptions = {}) {
  if (!value) return 'Unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', ...opts }).format(date);
}

function shortDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function relative(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Home() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [timeline, setTimeline] = useState<Cluster[]>([]);
  const [details, setDetails] = useState<Record<string, Cluster>>({});
  const [selected, setSelected] = useState<Cluster | null>(null);
  const [sourceFilter, setSourceFilter] = useState('All sources');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [jobMessage, setJobMessage] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [clusterData, timelineData] = await Promise.all([api.clusters(), api.timeline()]);
      setClusters(clusterData); setTimeline(timelineData);
      const entries = await Promise.all(clusterData.map(async c => [c.clusterId, await api.cluster(c.clusterId)] as const));
      setDetails(Object.fromEntries(entries));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load News Pulse');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const sources = useMemo(() => {
    const set = new Set<string>();
    Object.values(details).forEach(c => c.articles?.forEach(a => set.add(sourceOf(a))));
    return ['All sources', ...Array.from(set).sort()];
  }, [details]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return timeline.filter(c => {
      const detail = details[c.clusterId];
      const sourceMatch = sourceFilter === 'All sources' || detail?.articles?.some(a => sourceOf(a) === sourceFilter);
      const text = `${c.label} ${detail?.articles?.map(a => `${a.title} ${a.summary}`).join(' ') || ''}`.toLowerCase();
      return sourceMatch && (!q || text.includes(q));
    });
  }, [timeline, details, sourceFilter, query]);

  const stats = useMemo(() => {
    const articleCount = visible.reduce((n, c) => n + (c.articleCount || 0), 0);
    const activeSources = new Set<string>();
    visible.forEach(c => details[c.clusterId]?.articles?.forEach(a => activeSources.add(sourceOf(a))));
    return { topics: visible.length, articles: articleCount, sources: activeSources.size };
  }, [visible, details]);

  const handleRefresh = async () => {
    setRefreshing(true); setJobMessage('Starting ingestion…');
    try {
      const { jobId } = await api.trigger();
      let done = false;
      for (let i = 0; i < 30 && !done; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const status = await api.status(jobId);
        const state = String(status.status || status.state || '').toLowerCase();
        setJobMessage(status.message || (state ? `Ingestion ${state}…` : 'Checking ingestion…'));
        done = ['completed','complete','done','success','failed','error'].includes(state);
        if (state === 'failed' || state === 'error') throw new Error(status.message || 'Ingestion failed');
      }
      await load(); setJobMessage('News updated');
    } catch (e) { setJobMessage(e instanceof Error ? e.message : 'Refresh failed'); }
    finally { setRefreshing(false); setTimeout(() => setJobMessage(''), 3500); }
  };

  const maxCount = Math.max(1, ...visible.map(c => c.articleCount || 1));

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><span /><span /><span /></div><div><div className="brand-name">News Pulse</div><div className="brand-sub">Topic intelligence, at a glance</div></div></div>
        <div className="top-actions"><div className="live"><i /> LIVE DATA</div><button className="refresh" onClick={handleRefresh} disabled={refreshing}><span className={refreshing ? 'spin' : ''}>↻</span>{refreshing ? 'Refreshing…' : 'Refresh data'}</button></div>
      </header>

      <section className="hero">
        <div><div className="eyebrow">THE NEWS, CONNECTED</div><h1>See the stories <em>behind</em><br />the headlines.</h1><p>News Pulse groups related coverage into living topic clusters, so you can understand what is happening — and how long it has been happening.</p></div>
        <div className="hero-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit o3"/><div className="orbit-core"><span>NP</span></div><b>LIVE</b></div>
      </section>

      <section className="control-row">
        <div className="stats"><div><strong>{stats.topics}</strong><span>Topics</span></div><div><strong>{stats.articles}</strong><span>Articles</span></div><div><strong>{stats.sources}</strong><span>Sources</span></div></div>
        <div className="controls"><div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stories…" /></div><select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>{sources.map(s => <option key={s}>{s}</option>)}</select></div>
      </section>

      {jobMessage && <div className="toast">{jobMessage}</div>}
      {error && <div className="error"><strong>Couldn’t load the pulse.</strong><span>{error}</span><button onClick={load}>Try again</button></div>}

      <section className="timeline-card">
        <div className="section-head"><div><div className="eyebrow">TOPIC TIMELINE</div><h2>What’s moving right now</h2></div><div className="legend"><span className="legend-dot"/>Cluster activity <span className="legend-line"/>Time span</div></div>
        <div className="timeline-wrap">
          <div className="time-axis"><span>RECENT</span><span>PAST 24H</span><span>PAST 48H</span><span>PAST 72H</span></div>
          <div className="timeline-grid">
            <div className="now-line"><span>NOW</span></div>
            {loading ? <div className="loading-state"><div className="loader"/><p>Mapping the latest stories…</p></div> : visible.length === 0 ? <div className="empty">No clusters match your filters.</div> : visible.map((cluster, index) => {
              const detail = details[cluster.clusterId];
              const count = cluster.articleCount || 1;
              const width = 18 + (count / maxCount) * 34;
              const top = 28 + (index % 6) * 72;
              return <button key={cluster.clusterId} className="cluster-marker" style={{ top, ['--w' as string]: `${width}%` }} onClick={() => setSelected(detail || cluster)}><div className="marker-track"/><div className="marker-pill"><span className="pulse" style={{ ['--size' as string]: `${8 + Math.min(count, 12) * 1.5}px` }} /><div><strong>{cluster.label}</strong><small>{count} {count === 1 ? 'article' : 'articles'} · {shortDate(cluster.startTime)}</small></div><b>→</b></div></button>;
            })}
          </div>
        </div>
      </section>

      <section className="story-strip"><div><div className="eyebrow">CLUSTER EXPLORER</div><h2>Follow the signal.</h2></div><p>Select any cluster above to open the full coverage trail, compare sources, and jump to the original reporting.</p></section>

      {selected && <div className="overlay" onClick={() => setSelected(null)}><aside className="drawer" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setSelected(null)}>×</button><div className="drawer-kicker">TOPIC CLUSTER</div><h2>{selected.label}</h2><div className="range">{formatDate(selected.startTime)} <span>→</span> {formatDate(selected.endTime)}</div><div className="drawer-stats"><div><strong>{selected.articleCount}</strong><span>Articles</span></div><div><strong>{new Set(selected.articles?.map(sourceOf)).size}</strong><span>Sources</span></div></div><div className="coverage">{(selected.articles || []).map((article, i) => <article className="article" key={`${article.title}-${i}`}><div className="article-meta"><span>{sourceOf(article)}</span><time>{relative(article.published)}</time></div><h3>{article.title || 'Untitled story'}</h3>{article.summary && <p>{article.summary}</p>}<a href={articleUrl(article)} target="_blank" rel="noreferrer">Read original <span>↗</span></a></article>)}</div></aside></div>}
    </main>
  );
}
