import {
  formatDateKey,
  getWeekDays,
  parseSlotDate,
  startOfWeekMonday,
} from "../utils/dates";

export default function WeeklySlotGrid({
  slots,
  weekStart,
  onPrevWeek,
  onNextWeek,
  onSelectSlot,
  weekLabel,
}) {
  const days = getWeekDays(weekStart);

  const slotsByDay = {};
  days.forEach((d) => {
    slotsByDay[d.key] = [];
  });

  slots.forEach((slot) => {
    const key = formatDateKey(parseSlotDate(slot));
    if (slotsByDay[key]) {
      slotsByDay[key].push(slot);
    }
  });

  Object.keys(slotsByDay).forEach((key) => {
    slotsByDay[key].sort((a, b) => a.time.localeCompare(b.time));
  });

  const allTimes = [...new Set(slots.map((s) => s.time))].sort();

  const timesToShow =
    allTimes.length > 0 ? allTimes : ["09:00", "10:00", "11:00", "16:00", "17:00"];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-ghost px-5 py-4">
        <button
          type="button"
          onClick={onPrevWeek}
          className="btn-secondary px-4 py-2 text-sm"
        >
          ← Previous
        </button>
        <p className="text-center font-display text-base font-semibold text-midnight sm:text-lg">
          {weekLabel}
        </p>
        <button
          type="button"
          onClick={onNextWeek}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Next →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="bg-ghost">
              <th className="border-b border-slate-100 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className="border-b border-slate-100 px-2 py-4 text-center"
                >
                  <span className="block text-sm font-semibold text-midnight">
                    {day.label}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-slate-500">
                    {day.date.getDate()}{" "}
                    {day.date.toLocaleString("en-IN", { month: "short" })}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timesToShow.map((time) => (
              <tr key={time} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-semibold tabular-nums text-midnight">
                  {time}
                </td>
                {days.map((day) => {
                  const cellSlot = (slotsByDay[day.key] || []).find(
                    (s) => s.time === time
                  );

                  if (!cellSlot) {
                    return (
                      <td
                        key={`${day.key}-${time}`}
                        className="px-2 py-2.5 text-center"
                      >
                        <span className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-50 text-slate-300">
                          —
                        </span>
                      </td>
                    );
                  }

                  const available = !cellSlot.isBooked;

                  return (
                    <td key={`${day.key}-${time}`} className="px-2 py-2.5">
                      <button
                        type="button"
                        disabled={!available}
                        onClick={() => available && onSelectSlot(cellSlot)}
                        title={
                          available
                            ? "Click to book"
                            : `Booked by ${cellSlot.studentName || "someone"}`
                        }
                        className={`flex h-11 w-full items-center justify-center rounded-xl border text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                          available
                            ? "cursor-pointer border-emerald-200 bg-emerald-50 text-emerald-800 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {available ? "Available" : "Occupied"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-center gap-6 border-t border-slate-100 bg-ghost px-5 py-4 text-xs font-medium text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-4 w-10 rounded-lg border border-emerald-200 bg-emerald-50" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-10 rounded-lg border border-slate-200 bg-slate-100" />
          Occupied
        </span>
      </div>
    </div>
  );
}

export { startOfWeekMonday };
