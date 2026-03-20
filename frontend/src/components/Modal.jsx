// Modal.jsx
// Rule 9: White canvas, no tinted header block, close button is bare icon.
// Rule 20: Centered modal, not a bottom sheet. White, flat (no elevation on widget).

import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  const overlayRef = useRef();

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="modal-overlay"
    >
      <div className="modal-panel">
        {/* Header — Rule 9: flat, no tinted block */}
        <div className="modal-header">
          <h2 className="font-display text-xl font-bold text-ink tracking-tight">
            {title}
          </h2>
          {/* Close — bare icon button, Rule 9 */}
          <button
            onClick={onClose}
            className="btn-ghost w-8 h-8 flex items-center justify-center rounded-lg text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
