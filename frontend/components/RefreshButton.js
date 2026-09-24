'use client';

import { useEffect, useRef, useState } from 'react';
import { triggerIngest, fetchIngestStatus } from '../lib/api';

const POLL_INTERVAL_MS = 2500;
const TERMINAL_STATUSES = ['completed', 'done', 'success', 'failed', 'error'];

export default function RefreshButton({ onComplete }) {
  const [state, setState] = useState('idle'); // idle | running | error
  const [message, setMessage] = useState('');
  const pollRef = useRef(null);

  useEffect(() => () => clearInterval(pollRef.current), []);

  async function handleClick() {
    setState('running');
    setMessage('Triggering pipeline…');

    try {
      const jobId = await triggerIngest();
      if (!jobId) throw new Error('No job ID returned by the server.');

      pollRef.current = setInterval(async () => {
        try {
          const { status, message: statusMessage } = await fetchIngestStatus(jobId);
          setMessage(statusMessage || `Status: ${status}`);

          if (TERMINAL_STATUSES.includes(String(status).toLowerCase())) {
            clearInterval(pollRef.current);
            const failed = ['failed', 'error'].includes(String(status).toLowerCase());
            setState(failed ? 'error' : 'idle');
            if (!failed) {
              setMessage('Timeline updated');
              onComplete?.();
              setTimeout(() => setMessage(''), 3000);
            }
          }
        } catch (err) {
          clearInterval(pollRef.current);
          setState('error');
          setMessage(err.message || 'Lost track of the ingest job.');
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      setState('error');
      setMessage(err.message || 'Could not trigger the pipeline.');
    }
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className={`text-xs ${state === 'error' ? 'text-wire-red' : 'text-wire-dim'}`}>
          {message}
        </span>
      )}
      <button
        onClick={handleClick}
        disabled={state === 'running'}
        className="rounded-md border border-wire-amber bg-wire-amber/10 px-4 py-2 text-sm font-medium text-wire-amber transition-colors hover:bg-wire-amber/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === 'running' ? 'Refreshing…' : 'Refresh data'}
      </button>
    </div>
  );
}
