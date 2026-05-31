import { useEffect, useState } from "react";
import { formatDisplayDate, toISODateInput, parseSlotDate } from "../utils/dates";

export default function EditSlotModal({ slot, onClose, onSave, loading }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [resetBooking, setResetBooking] = useState(false);

  useEffect(() => {
    if (slot) {
      setDate(toISODateInput(parseSlotDate(slot)));
      setTime(slot.time);
      setResetBooking(false);
    }
  }, [slot]);

  if (!slot) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resetBooking) {
      onSave({ resetBooking: true });
      return;
    }
    onSave({
      date: new Date(`${date}T00:00:00.000Z`).toISOString(),
      time,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 p-4 backdrop-blur-md">
      <div className="premium-card w-full max-w-md animate-fade-in p-6">
        <h2 className="font-display text-xl font-semibold text-midnight">
          Edit slot
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {formatDisplayDate(slot.date)} · {slot.time}
          {slot.isBooked && (
            <span className="ml-2 text-red-600">
              (Booked: {slot.studentName})
            </span>
          )}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={resetBooking}
              onChange={(e) => setResetBooking(e.target.checked)}
              className="rounded text-cerulean focus:ring-cerulean"
            />
            Reset booking (mark as available)
          </label>

          {!resetBooking && (
            <>
              <div>
                <label className="premium-label">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="premium-input"
                />
              </div>
              <div>
                <label className="premium-label">Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="premium-input"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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
              disabled={loading}
              className="btn-primary sm:flex-1"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
