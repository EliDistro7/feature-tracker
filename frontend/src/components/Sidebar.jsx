// Sidebar.jsx
// Rule 8:  Use Flutter's native Scaffold.drawer equivalent — here we use
//          the persistent sidebar pattern (Rule 13: three-zone canvas).
// Rule 14: Flat rows + section labels. No card wrapper around nav sections.
//          Active: bold text + left accent bar. Dividers between sections.
// Rule 4:  Icons stand alone — no tinted rounded boxes.
// Rule 1:  White surface, separated from main by a single hairline (right border).
// Rule 17: Wordmark top-left — icon + text, no background box.

import { useState } from 'react';

const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { id: 'all',         label: 'All Features',  icon: '◈', count: null },
    ],
  },
  {
    section: 'By Status',
    items: [
      { id: 'Open',        label: 'Open',          icon: '○', dot: 'bg-status-open'        },
      { id: 'In Progress', label: 'In Progress',   icon: '◑', dot: 'bg-status-in-progress' },
      { id: 'Completed',   label: 'Completed',     icon: '●', dot: 'bg-status-completed'   },
    ],
  },
  {
    section: 'By Priority',
    items: [
      { id: 'High',        label: 'High Priority', icon: '▲', dot: 'bg-priority-high'   },
      { id: 'Medium',      label: 'Medium',        icon: '▶', dot: 'bg-priority-medium' },
      { id: 'Low',         label: 'Low Priority',  icon: '▽', dot: 'bg-priority-low'    },
    ],
  },
];

export default function Sidebar({ activeFilter, onFilterChange, counts, onNewFeature, mobileOpen, onMobileClose }) {
  const getCount = (id) => {
    if (id === 'all') return counts.total;
    if (id === 'Open')        return counts.open;
    if (id === 'In Progress') return counts.inProgress;
    if (id === 'Completed')   return counts.completed;
    if (id === 'High')        return counts.high;
    if (id === 'Medium')      return counts.medium;
    if (id === 'Low')         return counts.low;
    return null;
  };

  return (
    <>
      {/* ── Mobile overlay scrim ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* ── Sidebar panel ──
          Rule 1: white surface. Rule 13: fixed width 260px.
          Rule 8: persistent on md+, drawer slide-in on mobile.         */}
      <aside className={`
        fixed top-0 left-0 h-full w-[260px] bg-canvas border-r border-hairline z-40
        flex flex-col
        transition-transform duration-slide
        md:translate-x-0 md:static md:h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* ── Wordmark (Rule 17) ── */}
        <div className="h-14 flex items-center justify-between px-5 border-b border-hairline flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-base leading-none">⚡</span>
            <span className="font-display text-xl font-bold text-ink tracking-tight">
              FeatureTrack
            </span>
          </div>
          {/* Mobile close — bare icon (Rule 4) */}
          <button
            onClick={onMobileClose}
            className="md:hidden btn-ghost w-8 h-8 flex items-center justify-center text-lg"
          >
            ×
          </button>
        </div>

        {/* ── New Feature CTA ── */}
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <button onClick={onNewFeature} className="btn-primary w-full justify-center">
            <span className="text-base leading-none font-light">+</span>
            New Feature
          </button>
        </div>

        {/* ── Nav sections (Rule 14: flat rows, section labels, dividers) ── */}
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((group, gi) => (
            <div key={group.section}>
              {/* Rule 2: hairline between sections (except first) */}
              {gi > 0 && <div className="hairline my-2" />}

              {/* Rule 14: uppercase section label */}
              <p className="section-label px-5 pt-3 pb-1.5">{group.section}</p>

              {group.items.map(item => {
                const isActive = activeFilter === item.id;
                const count = getCount(item.id);
                return (
                  // Rule 7: flat row — Padding > Row, no card wrapper
                  // Rule 16: hover state replaces tap feedback
                  <button
                    key={item.id}
                    onClick={() => { onFilterChange(item.id); onMobileClose(); }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left
                      relative transition-colors duration-fast group
                      ${isActive
                        ? 'text-ink'
                        : 'text-ink-muted hover:text-ink hover:bg-surface'
                      }
                    `}
                  >
                    {/* Active indicator — left accent bar (Rule 6 equivalent) */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ink rounded-r-full" />
                    )}

                    {/* Icon — Rule 4: stands alone, no tinted box */}
                    <span className={`
                      text-sm w-4 text-center flex-shrink-0 leading-none
                      ${isActive ? 'text-ink' : 'text-ink-faint group-hover:text-ink-muted'}
                    `}>
                      {item.icon}
                    </span>

                    {/* Label */}
                    <span className={`flex-1 text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>

                    {/* Count — Rule 5: plain text, not a pill */}
                    {count != null && (
                      <span className={`
                        data-text text-xs flex-shrink-0
                        ${isActive ? 'text-ink-muted' : 'text-ink-faint'}
                      `}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        {/* Rule 2: hairline above footer */}
        <div className="border-t border-hairline px-5 py-4 flex-shrink-0">
          <p className="text-xs text-ink-faint">
            Feature Request Tracker
          </p>
          <p className="text-2xs text-ink-faint mt-0.5 uppercase tracking-wider font-semibold">
            Tanzanite Skills Academy
          </p>
        </div>
      </aside>
    </>
  );
}
