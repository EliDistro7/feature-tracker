// App.js
// Rule 13: Three-zone desktop canvas — sidebar (260px) + main content.
// Rule 1:  White canvas, bg-surface scaffold. Content flows directly on it.
// Rule 2:  Hairlines separate all zones. No shadow on sidebar.
// Rule 8:  Native drawer pattern on mobile (Sidebar handles overlay).
// Rule 15: Generous spacing — gap-10 between sections, gap-6 within.
// Rule 21: Responsive breakpoints — md:720px triggers persistent sidebar.

import { useState, useEffect, useCallback } from 'react';
import { featureApi } from './api';
import FeatureCard from './components/FeatureCard';
import FeatureForm from './components/FeatureForm';
import Modal       from './components/Modal';
import StatsBar    from './components/StatsBar';
import Sidebar     from './components/Sidebar';

const STATUS_FILTERS   = ['Open', 'In Progress', 'Completed'];
const PRIORITY_FILTERS = ['High', 'Medium', 'Low'];

export default function App() {
  const [features,      setFeatures]      = useState([]);
  const [filter,        setFilter]        = useState('all');
  const [search,        setSearch]        = useState('');
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState(null);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [editing,       setEditing]       = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast,         setToast]         = useState(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Determine API query params from active filter
  const apiParams = () => {
    if (filter === 'all') return {};
    if (STATUS_FILTERS.includes(filter))   return { status: filter };
    if (PRIORITY_FILTERS.includes(filter)) return { priority: filter };
    return {};
  };

  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = apiParams();
      // Status filter goes to API; priority filter is client-side
      const res = await featureApi.getAll(params.status || null);
      setFeatures(res.data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Client-side priority filter
  const displayed = features.filter(f => {
    const matchesPriority = PRIORITY_FILTERS.includes(filter) ? f.priority === filter : true;
    const matchesSearch   = search
      ? f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.description.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesPriority && matchesSearch;
  });

  // Counts for sidebar nav
  const counts = {
    total:      features.length,
    open:       features.filter(f => f.status === 'Open').length,
    inProgress: features.filter(f => f.status === 'In Progress').length,
    completed:  features.filter(f => f.status === 'Completed').length,
    high:       features.filter(f => f.priority === 'High').length,
    medium:     features.filter(f => f.priority === 'Medium').length,
    low:        features.filter(f => f.priority === 'Low').length,
  };

  // Page title from active filter
  const pageTitle = filter === 'all'          ? 'All Features'
    : filter === 'In Progress'                ? 'In Progress'
    : filter;

  const pageSubtitle =
    STATUS_FILTERS.includes(filter)   ? 'Filtered by status' :
    PRIORITY_FILTERS.includes(filter) ? 'Filtered by priority' :
    'Manage and track your feature requests';

  return (
    // Rule 13: three-zone shell — sidebar + main on md+
    <div className="min-h-screen bg-surface flex">

      {/* ── SIDEBAR (Rule 13, Rule 14) ── */}
      <Sidebar
        activeFilter={filter}
        onFilterChange={setFilter}
        counts={counts}
        onNewFeature={() => setModalOpen(true)}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* ── MAIN CONTENT ZONE (Rule 13: flex-1) ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* ── Top bar (mobile only — md+ sidebar has wordmark) ──
            Rule 6: flat, hairline below, no shadow.                   */}
        <header className="md:hidden bg-canvas border-b border-hairline h-14 flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-20">
          {/* Hamburger — bare icon (Rule 4) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost w-9 h-9 flex items-center justify-center text-ink"
            aria-label="Open menu"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect width="18" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="6" width="12" height="1.5" rx="0.75" fill="currentColor"/>
              <rect y="12" width="18" height="1.5" rx="0.75" fill="currentColor"/>
            </svg>
          </button>
          <span className="font-display text-lg font-bold text-ink tracking-tight flex-1">FeatureTrack</span>
          <button onClick={() => setModalOpen(true)} className="btn-primary text-xs px-3 py-2">
            + New
          </button>
        </header>

        {/* ── Page header (Rule 15: generous spacing, Rule 18: desktop page title) ── */}
        <div className="bg-canvas border-b border-hairline px-8 py-7 flex-shrink-0">
          <div className="max-w-content">
            {/* Breadcrumb / context — Rule 5: plain text */}
            <p className="section-label mb-2">Dashboard</p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-4xl font-bold text-ink tracking-tight leading-none">
                  {pageTitle}
                </h1>
                <p className="text-sm text-ink-muted mt-2">{pageSubtitle}</p>
              </div>
              {/* Count chip — Rule 5: plain text not pill */}
              {!loading && (
                <span className="data-text text-3xl font-bold text-ink-faint leading-none mb-1 flex-shrink-0">
                  {displayed.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Scrollable content area ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-content px-8 py-8">

            {/* Stats bar */}
            <StatsBar features={features} />

            {/* ── Search bar (Rule 3: control) ── */}
            <div className="relative mb-6">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint text-sm pointer-events-none select-none">
                🔍
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${displayed.length} feature${displayed.length !== 1 ? 's' : ''}…`}
                className="field-input pl-9 max-w-form"
              />
            </div>

            {/* Rule 2: hairline before grid */}
            <div className="hairline mb-6" />

            {/* ── Error ── */}
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
                <span className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading features…</span>
              </div>

            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <span className="text-5xl leading-none">📋</span>
                <div>
                  <p className="font-display text-xl font-bold text-ink">No features found</p>
                  <p className="text-sm text-ink-muted mt-1.5">
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
              <>
                {/* ── Feature grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

                {/* Rule 2: hairline + plain count footer */}
                <div className="hairline mt-8 mb-4" />
                <p className="text-xs text-ink-faint data-text text-center">
                  Showing {displayed.length} of {features.length} feature{features.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Feature Request">
        <FeatureForm onSubmit={handleCreate} onCancel={() => setModalOpen(false)} loading={saving} />
      </Modal>

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Feature Request">
        <FeatureForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} loading={saving} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Feature?">
        <p className="text-sm text-ink-muted leading-relaxed">
          This will permanently delete this feature request. This action cannot be undone.
        </p>
        <div className="hairline mt-6 mb-5" />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDeleteConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger">Delete</button>
        </div>
      </Modal>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'bg-danger text-white' : 'bg-ink text-white'}`}>
          <span className="text-xs">{toast.type === 'error' ? '✕' : '✓'}</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
