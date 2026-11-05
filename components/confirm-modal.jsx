"use client";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  busy = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;
  return (
    <div className="modal modal-open" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-box max-w-sm rounded-2xl"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 8v5m0 3.5v.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <h3 className="font-display text-center text-lg font-bold">{title}</h3>
        <p className="mt-2 text-center text-sm text-base-content/70">
          {message}
        </p>
        <div className="modal-action justify-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="btn btn-ghost rounded-full px-6"
            disabled={busy}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="btn btn-error rounded-full px-6 text-error-content"
          >
            {busy ? <span className="loading loading-spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
