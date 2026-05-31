import { useCallback, useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import EnquiryDataView from "../components/admin/EnquiryDataView";
import SlotDataView from "../components/admin/SlotDataView";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditSlotModal from "../components/EditSlotModal";
import { deleteAllEnquiries, fetchEnquiries } from "../api/enquiryApi";
import {
  createSlot,
  deleteSlot,
  fetchSlots,
  updateSlot,
} from "../api/slotsApi";
import { isoDateAtMidnight } from "../utils/dates";
import { exportEnquiriesToExcel } from "../utils/exportEnquiries";

export default function AdminDashboard({ onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearingEnquiries, setClearingEnquiries] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [enquiryRes, slotRes] = await Promise.all([
        fetchEnquiries(),
        fetchSlots(),
      ]);
      setEnquiries(enquiryRes.data || []);
      setSlots(slotRes.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load admin data. Check VITE_ADMIN_API_KEY matches server ADMIN_API_KEY."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;
    setAddingSlot(true);
    try {
      await createSlot(isoDateAtMidnight(newDate), newTime);
      setNewDate("");
      setNewTime("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add slot");
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot permanently?")) return;
    try {
      await deleteSlot(id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete slot");
    }
  };

  const handleExportExcel = () => {
    if (enquiries.length === 0) {
      setError("No enquiries to export.");
      return;
    }
    setError("");
    exportEnquiriesToExcel(enquiries);
  };

  const handleClearAllClick = () => {
    if (enquiries.length === 0) {
      setError("There are no enquiries to delete.");
      return;
    }
    setShowClearConfirm(true);
  };

  const handleConfirmClearAll = async () => {
    setClearingEnquiries(true);
    setError("");
    try {
      await deleteAllEnquiries();
      setShowClearConfirm(false);
      setEnquiries([]);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete enquiries. Try again."
      );
    } finally {
      setClearingEnquiries(false);
    }
  };

  const handleSaveEdit = async (payload) => {
    if (!editingSlot) return;
    setSavingEdit(true);
    try {
      await updateSlot(editingSlot._id, payload);
      setEditingSlot(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update slot");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-midnight sm:text-3xl">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-base text-slate-600 sm:text-sm">
            Manage enquiries and tuition slots
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn-secondary shrink-0"
        >
          Log out
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Loading dashboard…</p>
      ) : (
        <>
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
            <div className="border-b border-slate-100 bg-ghost px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-midnight sm:text-xl">
                    Enquiries received
                  </h3>
                  <p className="text-sm text-slate-600">
                    {enquiries.length} total
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    disabled={enquiries.length === 0}
                    className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-midnight shadow-sm transition-all hover:border-cerulean/40 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2.5 sm:text-sm"
                  >
                    <Download className="h-4 w-4 text-cerulean" aria-hidden />
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllClick}
                    disabled={enquiries.length === 0}
                    className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-3 text-base font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2.5 sm:text-sm"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Clear All Enquiries
                  </button>
                </div>
              </div>
            </div>
            <EnquiryDataView enquiries={enquiries} />
          </section>

          <section className="premium-card">
            <h3 className="font-display text-xl font-semibold text-midnight">
              Add new slot
            </h3>
            <form
              onSubmit={handleAddSlot}
              className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
            >
              <div className="w-full sm:w-auto sm:min-w-[10rem] sm:flex-1">
                <label className="premium-label">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="premium-input"
                />
              </div>
              <div className="w-full sm:w-auto sm:min-w-[10rem] sm:flex-1">
                <label className="premium-label">Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="premium-input"
                />
              </div>
              <button
                type="submit"
                disabled={addingSlot}
                className="btn-primary w-full sm:w-auto"
              >
                {addingSlot ? "Adding…" : "Add slot"}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl sm:rounded-3xl">
            <div className="border-b border-slate-100 bg-ghost px-4 py-4 sm:px-6">
              <h3 className="font-display text-lg font-semibold text-midnight sm:text-xl">
                Slot manager
              </h3>
            </div>
            <SlotDataView
              slots={slots}
              onEdit={setEditingSlot}
              onDelete={handleDelete}
            />
          </section>
        </>
      )}

      {editingSlot && (
        <EditSlotModal
          slot={editingSlot}
          loading={savingEdit}
          onClose={() => setEditingSlot(null)}
          onSave={handleSaveEdit}
        />
      )}

      {showClearConfirm && (
        <ConfirmDeleteModal
          title="Clear all enquiries?"
          message="Are you sure you want to delete all enquiry data? This action cannot be undone."
          note="This only clears the dashboard database (MongoDB). Your Google Sheet backup will not be changed."
          confirmLabel="Yes, delete all"
          loading={clearingEnquiries}
          onClose={() => !clearingEnquiries && setShowClearConfirm(false)}
          onConfirm={handleConfirmClearAll}
        />
      )}
    </div>
  );
}
