const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse errors, keep default message
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

// Backend field names aren't pinned down by the spec (e.g. startTime vs start),
// so every consumer of this data normalizes through these helpers instead of
// reading raw response fields directly.
function pick(obj, keys, fallback = undefined) {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
}

export function normalizeTimelineEntry(raw) {
  return {
    id: pick(raw, ['id', 'clusterId', '_id']),
    label: pick(raw, ['label', 'title'], 'Untitled cluster'),
    start: pick(raw, ['start', 'startTime', 'earliest']),
    end: pick(raw, ['end', 'endTime', 'latest']),
    count: pick(raw, ['count', 'articleCount', 'size'], 0),
    intensity: pick(raw, ['intensity', 'weight'], undefined),
    sources: pick(raw, ['sources'], []),
  };
}

export function normalizeCluster(raw) {
  return {
    id: pick(raw, ['id', 'clusterId', '_id']),
    label: pick(raw, ['label', 'title'], 'Untitled cluster'),
    articleCount: pick(raw, ['articleCount', 'count'], 0),
    start: pick(raw, ['start', 'startTime', 'earliest']),
    end: pick(raw, ['end', 'endTime', 'latest']),
  };
}

export function normalizeArticle(raw) {
  return {
    id: pick(raw, ['id', '_id', 'url']),
    headline: pick(raw, ['headline', 'title'], 'Untitled article'),
    source: pick(raw, ['source', 'outlet', 'feed'], 'Unknown source'),
    publishedAt: pick(raw, ['publishedAt', 'publishedTime', 'pubDate', 'published']),
    url: pick(raw, ['url', 'link'], '#'),
    summary: pick(raw, ['summary', 'description'], ''),
  };
}

export async function fetchTimeline() {
  const data = await request('/timeline');
  const list = Array.isArray(data) ? data : data?.timeline || data?.clusters || [];
  return list.map(normalizeTimelineEntry);
}

export async function fetchClusters() {
  const data = await request('/clusters');
  const list = Array.isArray(data) ? data : data?.clusters || [];
  return list.map(normalizeCluster);
}

export async function fetchClusterDetail(id) {
  const data = await request(`/clusters/${id}`);
  const cluster = normalizeCluster(data);
  const articlesRaw = data?.articles || [];
  cluster.articles = articlesRaw.map(normalizeArticle);
  return cluster;
}

export async function triggerIngest() {
  const data = await request('/ingest/trigger', { method: 'POST' });
  return pick(data, ['jobId', 'id'], null);
}

export async function fetchIngestStatus(jobId) {
  const data = await request(`/ingest/status/${jobId}`);
  return {
    status: pick(data, ['status'], 'unknown'),
    message: pick(data, ['message', 'detail'], ''),
  };
}

export { BASE_URL };
