// App.js
// Rule 1: white canvas scaffold — bg-surface, no nested grey wrappers.
// Rule 2: hairlines separate header from content.
// Rule 6: header is a flat surface, not a card.
// Rule 13: responsive — mobile first, desktop sidebar layout at md+.

import { useState, useEffect, useCallback } from 'react';
import { featureApi } from './api';
import FeatureCard   from './components/FeatureCard';
import FeatureForm   from './components/FeatureForm';
import Modal         from './components/Modal';
import StatsBar      from './components/StatsBar';

const FILTERS = ['All', 'Open', 'In Progress', 'Completed'];

export default function App() {
  const [features,      setFeatures]      = useState([]);
  const [filter,        setFilter]        = useState('All');
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editing,       setEditing]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await featureApi.getAll(filter !== 'All' ? filter : null);
      setFeatures(res.data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchFeatures(); }, [fetchFeatures]);

  const handleCreate = async (form) => {
    try { setSaving(true); await featureApi.create(form); showToast('Feature created'); setModalOpen(false); fetchFeatures(); }
    catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleUpdate = async (form) => {
    try { setSaving(true); await featureApi.update(editing.id, form); showToast('Feature updated'); setEditing(null); fetchFeatures(); }
    catch (e) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await featureApi.delete(id); showToast('Feature deleted'); setDeleteConfirm(null); fetchFeatures(); }
    catch (e) { showToast(e.message, 'error'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await featureApi.updateStatus(id, status); showToast('Status updated'); fetchFeatures(); }
    catch (e) { showToast(e.message, 'error'); }
  };

  const displayed = features.filter(f =>
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Rule 1: white canvas — bg-surface is the scaffold background
    <div className="min-h-screen bg-surface">

      {/* ── HEADER (Rule 6: flat surface, hairline below) ── */}
      <header className="bg-canvas sticky top-0 z-40 border-b border-hairline">
        <div className="max-w-content mx-auto px-6 h-14 flex items-center justify-between gap-4">

          {/* Wordmark — Rule 17: icon + text, no background box */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-lg">⚡</span>
            <span className="font-display text-xl font-bold text-ink tracking-tight">
              FeatureTrack
            </span>
          </div>

          {/* New feature button */}
          <button onClick={() => setModalOpen(true)} className="btn-primary text-sm">
            <span className="text-base leading-none">+</span>
            New Feature
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT (Rule 1: flows directly on canvas) ── */}
      <main className="max-w-content mx-auto px-6 py-8">

        {/* Stats bar */}
        <StatsBar features={features} />

        {/* ── Controls bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search — Rule 3: input IS a control */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-sm pointer-events-none">
              🔍
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search features…"
              className="field-input pl-9"
            />
          </div>

          {/* Filter chips — Rule 3: interactive period chips */}
          <div className="flex items-center gap-1 bg-canvas border border-hairline rounded-lg p-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`filter-chip ${filter === f ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Rule 2: hairline before content */}
        <div className="hairline mb-6" />

        {/* ── Error state ── */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-danger-border bg-danger-bg text-danger text-sm mb-6">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
            <button onClick={fetchFeatures} className="font-semibold underline underline-offset-2">Retry</button>
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink-muted">
            <span className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading features…</span>
          </div>

        ) : displayed.length === 0 ? (
          // ── Empty state ──
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-5xl">📋</span>
            <div>
              <p className="text-xl font-display font-bold text-ink">No features found</p>
              <p className="text-sm text-ink-muted mt-1">
                {search ? 'Try a different search term' : 'Create your first feature request to get started'}
              </p>
            </div>
            {!search && (
              <button onClick={() => setModalOpen(true)} className="btn-primary mt-2">
                + New Feature
              </button>
            )}
          </div>

        ) : (
          // ── Grid ──
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((f, i) => (
                <FeatureCard
                  key={f.id}
                  feature={f}
                  index={i}
                  onEdit={setEditing}
                  onDelete={setDeleteConfirm}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Rule 19: count — plain text, no badge */}
            <p className="text-center mt-8 text-xs text-ink-faint data-text">
              {displayed.length} of {features.length} feature{features.length !== 1 ? 's' : ''}
            </p>
          </>
        )}
      </main>

      {/* ── MODALS ── */}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Feature Request">
        <FeatureForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={saving} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Feature Request">
        <FeatureForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} loading={saving} />
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Feature?">
        <p className="text-sm text-ink-muted leading-relaxed">
          This will permanently delete the feature request. This action cannot be undone.
        </p>
        {/* Rule 2: hairline above actions */}
        <div className="hairline mt-6 mb-5" />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>

      {/* ── TOAST (Rule 5: no pill badge) ── */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'bg-danger text-white' : 'bg-ink text-white'}`}>
          <span>{toast.type === 'error' ? '✕' : '✓'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
