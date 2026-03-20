// Badge.jsx
// Rule 5: Status/Priority shown as dot + text. NO pill containers.
// Dots are 6px circles. Labels use plain styled text.

const PRIORITY = {
  High:   { dot: 'bg-priority-high',   label: 'text-red-700'   },
  Medium: { dot: 'bg-priority-medium', label: 'text-amber-700' },
  Low:    { dot: 'bg-priority-low',    label: 'text-green-700' },
};

const STATUS = {
  'Open':        { dot: 'bg-status-open',        label: 'text-blue-700'   },
  'In Progress': { dot: 'bg-status-in-progress', label: 'text-violet-700' },
  'Completed':   { dot: 'bg-status-completed',   label: 'text-green-700'  },
};

export function PriorityBadge({ value }) {
  const s = PRIORITY[value] || PRIORITY.Medium;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`status-dot ${s.dot}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${s.label}`}>{value}</span>
    </span>
  );
}

export function StatusBadge({ value }) {
  const s = STATUS[value] || STATUS['Open'];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`status-dot ${s.dot}`} />
      <span className={`text-xs font-semibold uppercase tracking-wider ${s.label}`}>{value}</span>
    </span>
  );
}
