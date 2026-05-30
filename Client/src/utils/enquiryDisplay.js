/**
 * Display phone for admin table (handles legacy records without phone).
 */
export function formatEnquiryPhone(row) {
  if (!row) return "N/A";

  const phone = row.phone != null ? String(row.phone).trim() : "";
  if (phone) return phone;

  const code = row.countryCode != null ? String(row.countryCode).trim() : "";
  const mobile =
    row.mobile != null ? String(row.mobile).replace(/\D/g, "") : "";

  if (code && mobile) return `${code} ${mobile}`;
  if (code) return code;
  if (mobile) return mobile;

  return "N/A";
}
