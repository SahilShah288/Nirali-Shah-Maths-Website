import { formatDisplayDate } from "../../utils/dates";
import { formatEnquiryPhone } from "../../utils/enquiryDisplay";

export default function EnquiryDataView({ enquiries }) {
  if (enquiries.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-slate-400">No enquiries yet</p>
    );
  }

  return (
    <>
      <div className="space-y-3 p-4 md:hidden">
        {enquiries.map((row) => (
          <article key={row._id} className="admin-card">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <p className="admin-card-label">Parent Name</p>
                <p className="text-base font-semibold text-midnight">{row.name}</p>
              </div>
              <time className="shrink-0 text-xs text-slate-500">
                {formatDisplayDate(row.timestamp)}
              </time>
            </div>
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="admin-card-label">Phone</dt>
                <dd className="admin-card-value">{formatEnquiryPhone(row)}</dd>
              </div>
              <div>
                <dt className="admin-card-label">Country</dt>
                <dd className="admin-card-value">{row.country}</dd>
              </div>
              <div>
                <dt className="admin-card-label">Class</dt>
                <dd className="admin-card-value">Class {row.class}</dd>
              </div>
              <div>
                <dt className="admin-card-label">Board</dt>
                <dd className="admin-card-value">{row.board}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="admin-card-label">Competitive Exams</dt>
                <dd className="admin-card-value">
                  {(row.competitiveExams || []).join(", ") || "—"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden md:block">
        <p className="table-scroll-hint">Swipe horizontally to see all columns →</p>
        <div className="table-scroll">
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
              {enquiries.map((row) => (
                <tr
                  key={row._id}
                  className="border-t border-slate-100 hover:bg-ghost"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDisplayDate(row.timestamp)}
                  </td>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {formatEnquiryPhone(row)}
                  </td>
                  <td className="px-4 py-3">{row.country}</td>
                  <td className="px-4 py-3">Class {row.class}</td>
                  <td className="px-4 py-3">{row.board}</td>
                  <td className="px-4 py-3">
                    {(row.competitiveExams || []).join(", ") || "—"}
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
