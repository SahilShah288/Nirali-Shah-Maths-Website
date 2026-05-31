import { formatDisplayDate } from "../../utils/dates";

export default function SlotDataView({ slots, onEdit, onDelete }) {
  if (slots.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-slate-400">No slots scheduled</p>
    );
  }

  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {slots.map((slot) => (
          <article key={slot._id} className="admin-card">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="admin-card-label">Date & time</p>
                <p className="text-base font-semibold text-midnight">
                  {formatDisplayDate(slot.date)} · {slot.time}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  slot.isBooked
                    ? "bg-slate-200 text-slate-700"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {slot.isBooked ? "Occupied" : "Available"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              <span className="admin-card-label block">Student</span>
              {slot.studentName || "—"}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onEdit(slot)}
                className="btn-secondary min-h-[2.75rem] flex-1 py-2.5 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(slot._id)}
                className="min-h-[2.75rem] w-full rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 sm:flex-1"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <p className="table-scroll-hint">Swipe horizontally to see all columns →</p>
        <div className="table-scroll">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-ghost text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{formatDisplayDate(slot.date)}</td>
                  <td className="px-4 py-3">{slot.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        slot.isBooked
                          ? "bg-slate-200 text-slate-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {slot.isBooked ? "Occupied" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{slot.studentName || "—"}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(slot)}
                      className="rounded-lg border border-cerulean/30 px-3 py-2 text-xs font-medium text-cerulean hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(slot._id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
