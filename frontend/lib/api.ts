const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type Article = {
  title?: string;
  summary?: string;
  source?: string;
  published?: string;
  link?: string;
  url?: string;
};

export type Cluster = {
  clusterId: string;
  label: string;
  articleCount: number;
  startTime: string;
  endTime: string;
  intensity?: number;
  articles?: Article[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, { ...init, cache: 'no-store' });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

export const api = {
  timeline: () => request<Cluster[]>('/timeline'),
  clusters: () => request<Cluster[]>('/clusters'),
  cluster: (id: string) => request<Cluster>(`/clusters/${encodeURIComponent(id)}`),
  trigger: () => request<{ jobId: string }>('/ingest/trigger', { method: 'POST' }),
  status: (jobId: string) => request<{ status?: string; state?: string; message?: string }>(`/ingest/status/${encodeURIComponent(jobId)}`),
};
