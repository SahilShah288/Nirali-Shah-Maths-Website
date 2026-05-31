import { useState } from "react";

export default function BookingModal({ slot, onClose, onConfirm, loading }) {
  const [name, setName] = useState("");

  if (!slot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onConfirm(name.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div className="w-full max-w-md animate-fade-in overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
        <div className="border-b border-slate-100 bg-ghost px-6 py-5">
          <h2
            id="booking-title"
            className="font-display text-xl font-semibold text-midnight"
          >
            Book this slot
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter your name to book this slot.
          </p>
        </div>

        <div className="px-6 py-5">
          <p className="rounded-xl border border-slate-100 bg-ghost px-4 py-3 text-center text-sm font-semibold text-midnight">
            {slot.time} · {new Date(slot.date).toLocaleDateString("en-IN")}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <div>
              <label htmlFor="studentName" className="premium-label">
                Your name
              </label>
              <input
                id="studentName"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="premium-input"
                placeholder="Student name"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn-secondary sm:flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="btn-primary sm:flex-1"
              >
                {loading ? "Booking…" : "Confirm booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
