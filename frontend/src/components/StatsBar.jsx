// StatsBar.jsx
// Rule 1: white canvas tiles. Rule 5: no pill badges — plain numbers + labels.
// Rule 19 equivalent: monospace numbers, muted uppercase labels.

export default function StatsBar({ features }) {
  const stats = [
    { label: 'Total',         value: features.length,                                    },
    { label: 'Open',          value: features.filter(f => f.status === 'Open').length,   },
    { label: 'In Progress',   value: features.filter(f => f.status === 'In Progress').length },
    { label: 'Completed',     value: features.filter(f => f.status === 'Completed').length   },
    { label: 'High Priority', value: features.filter(f => f.priority === 'High').length  },
  ];

  return (
    // Rule 1: sits directly on canvas — no wrapper card
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden mb-8">
      {stats.map((s, i) => (
        <div key={s.label} className="bg-canvas px-5 py-4">
          {/* Monospace number — Rule 19 */}
          <div className="data-text text-3xl font-bold text-ink leading-none">{s.value}</div>
          {/* Section label style — Rule 14 / Rule 18 */}
          <div className="section-label mt-1.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
