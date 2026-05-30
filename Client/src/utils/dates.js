const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseSlotDate(slot) {
  return new Date(slot.date);
}

export function getWeekDays(weekStart) {
  return DAY_LABELS.map((label, i) => ({
    label,
    date: addDays(weekStart, i),
    key: formatDateKey(addDays(weekStart, i)),
  }));
}

export function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6);
  const opts = { day: "numeric", month: "short", year: "numeric" };
  return `${weekStart.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
}

export function formatDisplayDate(isoOrDate) {
  const d = new Date(isoOrDate);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toISODateInput(date) {
  return formatDateKey(date);
}

export function isoDateAtMidnight(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
}
