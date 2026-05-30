import { useCallback, useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditSlotModal from "../components/EditSlotModal";
import { deleteAllEnquiries, fetchEnquiries } from "../api/enquiryApi";
import {
  createSlot,
  deleteSlot,
  fetchSlots,
  updateSlot,
} from "../api/slotsApi";
import { formatDisplayDate, isoDateAtMidnight, parseSlotDate } from "../utils/dates";
import { formatEnquiryPhone } from "../utils/enquiryDisplay";
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold text-midnight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-600">
            Manage enquiries and tuition slots
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="btn-secondary px-4 py-2 text-sm"
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
          <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
            <div className="border-b border-slate-100 bg-ghost px-6 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-midnight">
                    Enquiries received
                  </h3>
                  <p className="text-sm text-slate-600">
                    {enquiries.length} total
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    disabled={enquiries.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-midnight shadow-sm transition-all hover:-translate-y-0.5 hover:border-cerulean/40 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="h-4 w-4 text-cerulean" aria-hidden />
                    Export to Excel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllClick}
                    disabled={enquiries.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                    Clear All Enquiries
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-ghost text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Country</th>
                    <th className="px-4 py-3 font-medium">Class</th>
                    <th className="px-4 py-3 font-medium">Board</th>
                    <th className="px-4 py-3 font-medium">Exams</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No enquiries yet
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((row) => (
                      <tr
                        key={row._id}
                        className="border-t border-slate-100 hover:bg-ghost"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {formatDisplayDate(row.timestamp)}
                        </td>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {formatEnquiryPhone(row)}
                        </td>
                        <td className="px-4 py-3">{row.country}</td>
                        <td className="px-4 py-3">Class {row.class}</td>
                        <td className="px-4 py-3">{row.board}</td>
                        <td className="px-4 py-3">
                          {(row.competitiveExams || []).join(", ") || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="premium-card">
            <h3 className="font-display text-xl font-semibold text-midnight">
              Add new slot
            </h3>
            <form
              onSubmit={handleAddSlot}
              className="mt-4 flex flex-wrap items-end gap-4"
            >
              <div>
                <label className="premium-label">Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="premium-input"
                />
              </div>
              <div>
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
                className="btn-primary px-5 py-2.5"
              >
                {addingSlot ? "Adding…" : "Add slot"}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
            <div className="border-b border-slate-100 bg-ghost px-6 py-4">
              <h3 className="font-display text-xl font-semibold text-midnight">
                Slot manager
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-ghost text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No slots scheduled
                      </td>
                    </tr>
                  ) : (
                    slots.map((slot) => (
                      <tr
                        key={slot._id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-4 py-3">
                          {formatDisplayDate(slot.date)}
                        </td>
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
                        <td className="px-4 py-3">
                          {slot.studentName || "—"}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingSlot(slot)}
                            className="rounded-lg border border-cerulean/30 px-3 py-1 text-xs font-medium text-cerulean transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(slot._id)}
                            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
