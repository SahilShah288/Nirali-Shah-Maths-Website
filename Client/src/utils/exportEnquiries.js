import * as XLSX from "xlsx";
import { formatEnquiryPhone } from "./enquiryDisplay";

function formatExportDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Export enquiries array to Nirali_Shah_Enquiries_[Date].xlsx
 */
export function exportEnquiriesToExcel(enquiries) {
  const rows = (enquiries || []).map((row) => ({
    "Parent Name": row.name || "",
    Phone: formatEnquiryPhone(row) === "N/A" ? "" : formatEnquiryPhone(row),
    Country: row.country || "",
    Class: row.class != null ? `Class ${row.class}` : "",
    Board: row.board || "",
    "Competitive Exams": (row.competitiveExams || []).join(", "),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Enquiries");

  const filename = `Nirali_Shah_Enquiries_${formatExportDate()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
