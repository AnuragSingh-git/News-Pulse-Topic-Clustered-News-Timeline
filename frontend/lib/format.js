export function formatTimeRange(start, end) {
  if (!start) return 'Unknown time';
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;
  const opts = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };

  if (!endDate || startDate.getTime() === endDate.getTime()) {
    return startDate.toLocaleString(undefined, opts);
  }

  const sameDay = startDate.toDateString() === endDate.toDateString();
  if (sameDay) {
    return `${startDate.toLocaleString(undefined, opts)} – ${endDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }
  return `${startDate.toLocaleString(undefined, opts)} – ${endDate.toLocaleString(undefined, opts)}`;
}

export function formatExact(dateStr) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
