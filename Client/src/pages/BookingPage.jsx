import { useCallback, useEffect, useState } from "react";
import BookingModal from "../components/BookingModal";
import WeeklySlotGrid, {
  startOfWeekMonday,
} from "../components/WeeklySlotGrid";
import { bookSlot, fetchSlots } from "../api/slotsApi";
import SplitText from "../components/SplitText";
import { addDays, formatWeekRange } from "../utils/dates";

export default function BookingPage() {
  const [slots, setSlots] = useState([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeekMonday(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toast, setToast] = useState("");

  const loadSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchSlots();
      setSlots(res.data || []);
    } catch {
      setError("Could not load slots. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleBook = async (studentName) => {
    if (!selectedSlot) return;
    setBookingLoading(true);
    try {
      await bookSlot(selectedSlot._id, studentName);
      setToast("Slot booked successfully!");
      setSelectedSlot(null);
      await loadSlots();
      setTimeout(() => setToast(""), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again."
      );
      setSelectedSlot(null);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="space-y-12">
      <div className="page-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cerulean">
          Schedule
        </p>
        <SplitText
          tag="h2"
          text="Book a Tuition Slot"
          className="page-hero-title split-parent"
          delay={80}
          duration={0.65}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 36 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.15}
          rootMargin="-80px"
          textAlign="center"
        />
        <p className="page-hero-text max-w-lg">
          Choose an available slot from the weekly schedule below. Green slots
          are open; occupied slots cannot be selected.
        </p>
      </div>

      {toast && (
        <div className="mx-auto max-w-2xl animate-fade-in rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-center text-sm font-medium text-emerald-800">
          {toast}
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-cerulean" />
          <p className="text-sm font-medium text-slate-600">Loading schedule…</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <WeeklySlotGrid
            slots={slots}
            weekStart={weekStart}
            weekLabel={formatWeekRange(weekStart)}
            onPrevWeek={() => setWeekStart((w) => addDays(w, -7))}
            onNextWeek={() => setWeekStart((w) => addDays(w, 7))}
            onSelectSlot={setSelectedSlot}
          />
        </div>
      )}

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          loading={bookingLoading}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleBook}
        />
      )}
    </section>
  );
}
