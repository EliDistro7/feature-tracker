// FeatureForm.jsx
// Rule 15: form fields maxWidth form (520px), left-aligned, auto-width buttons.
// Rule 3: inputs ARE controls — border is justified.

import { useState, useEffect } from 'react';

const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES   = ['Open', 'In Progress', 'Completed'];

export default function FeatureForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium', status: 'Open', ...initial,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm({ title: '', description: '', priority: 'Medium', status: 'Open', ...initial });
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label className="field-label">Title</label>
        <input
          value={form.title}
          onChange={set('title')}
          placeholder="e.g. Add CSV export to reports"
          className={`field-input ${errors.title ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
        />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="field-label">Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows={4}
          placeholder="Describe what this feature should do and why it matters…"
          className={`field-input resize-none ${errors.description ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
        />
        {errors.description && <p className="field-error">{errors.description}</p>}
      </div>

      {/* Priority + Status — Rule 3: selects ARE controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Priority</label>
          <select value={form.priority} onChange={set('priority')} className="field-input">
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select value={form.status} onChange={set('status')} className="field-input">
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Rule 2: hairline above actions */}
      <div className="hairline" />

      {/* Actions — Rule 15: auto-width, not full-width */}
      <div className="flex gap-3 justify-end pt-1">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Saving…
            </span>
          ) : 'Save Feature'}
        </button>
      </div>
    </form>
  );
}
