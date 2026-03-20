// FeatureCard.jsx
// Rule 1: white canvas card. Rule 5: dots not pills. Rule 4: icons stand alone.
// Rule 7: flat rows inside card. Rule 2: hairline above footer.

import { useState } from 'react';
import { PriorityBadge, StatusBadge } from './Badge';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Completed'];

export default function FeatureCard({ feature, onEdit, onDelete, onStatusChange, index = 0 }) {
  const [changing, setChanging] = useState(false);

  const handleStatus = async (newStatus) => {
    setChanging(true);
    await onStatusChange(feature.id, newStatus);
    setChanging(false);
  };

  const date = new Date(feature.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const staggerClass = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <article className={`feature-card p-5 flex flex-col gap-4 animate-slide-up ${staggerClass}`}>

      {/* ── Header: title + actions ── */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-md font-bold text-ink leading-snug tracking-tight flex-1">
          {feature.title}
        </h3>
        {/* Actions — Rule 4: bare icon buttons, no tinted boxes */}
        <div className="flex gap-1 flex-shrink-0 -mt-0.5">
          <button
            onClick={() => onEdit(feature)}
            title="Edit"
            className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg text-sm"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(feature.id)}
            title="Delete"
            className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg text-sm text-danger hover:bg-danger-bg"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 -mt-1">
        {feature.description}
      </p>

      {/* ── Status + Priority dots (Rule 5: dots, not pills) ── */}
      <div className="flex items-center gap-4">
        <PriorityBadge value={feature.priority} />
        <StatusBadge   value={feature.status} />
      </div>

      {/* Rule 2: hairline above footer */}
      <div className="hairline" />

      {/* ── Footer ── */}
      <div className="flex items-center justify-between -mt-1">
        {/* Date — monospace data text (Rule 19) */}
        <span className="data-text text-xs text-ink-faint">{date}</span>

        {/* Inline status changer — Rule 3: select IS a control */}
        <select
          value={feature.status}
          disabled={changing}
          onChange={(e) => handleStatus(e.target.value)}
          className="text-xs font-semibold border border-border rounded-md px-2 py-1
                     bg-surface text-ink-muted cursor-pointer
                     focus:outline-none focus:border-neutral-400
                     hover:border-neutral-400 transition-colors duration-fast
                     disabled:opacity-50"
        >
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    </article>
  );
}
