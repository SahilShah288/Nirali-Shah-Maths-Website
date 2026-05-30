import { AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({
  title,
  message,
  note,
  confirmLabel = "Delete all",
  loading,
  onConfirm,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="w-full max-w-md animate-fade-in rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2
              id="confirm-delete-title"
              className="font-display text-xl font-semibold text-midnight"
            >
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {message}
            </p>
            {note && (
              <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                {note}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl border-2 border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
