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
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
      <div className="flex flex-col gap-3 border-b border-slate-100 bg-ghost px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={onPrevWeek}
          className="btn-secondary order-2 w-full text-sm sm:order-1 sm:w-auto"
        >
          ← Previous
        </button>
        <p className="order-1 text-center font-display text-base font-semibold text-midnight sm:order-2 sm:text-lg">
          {weekLabel}
        </p>
        <button
          type="button"
          onClick={onNextWeek}
          className="btn-secondary order-3 w-full text-sm sm:order-3 sm:w-auto"
        >
          Next →
        </button>
      </div>

      <p className="table-scroll-hint">Swipe horizontally to view the full week →</p>
      <div className="table-scroll">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="bg-ghost">
              <th className="border-b border-slate-100 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:px-4 sm:py-4">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day.key}
                  className="border-b border-slate-100 px-1 py-3 text-center sm:px-2 sm:py-4"
                >
                  <span className="block text-xs font-semibold text-midnight sm:text-sm">
                    {day.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium text-slate-500 sm:text-xs">
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
                <td className="px-3 py-2 font-semibold tabular-nums text-midnight sm:px-4 sm:py-3">
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
                        className="px-1 py-2 text-center sm:px-2 sm:py-2.5"
                      >
                        <span className="inline-flex h-12 w-full min-w-[4.5rem] items-center justify-center rounded-xl bg-slate-50 text-slate-300 sm:h-11">
                          —
                        </span>
                      </td>
                    );
                  }

                  const available = !cellSlot.isBooked;

                  return (
                    <td key={`${day.key}-${time}`} className="px-1 py-2 sm:px-2 sm:py-2.5">
                      <button
                        type="button"
                        disabled={!available}
                        onClick={() => available && onSelectSlot(cellSlot)}
                        title={
                          available
                            ? "Click to book"
                            : `Booked by ${cellSlot.studentName || "someone"}`
                        }
                        className={`flex h-12 w-full min-w-[4.5rem] items-center justify-center rounded-xl border px-1 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 sm:h-11 sm:text-xs ${
                          available
                            ? "cursor-pointer border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300 hover:shadow-md active:scale-[0.98]"
                            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {available ? "Open" : "Full"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-t border-slate-100 bg-ghost px-4 py-4 text-xs font-medium text-slate-600 sm:flex-row sm:gap-6 sm:px-5">
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
