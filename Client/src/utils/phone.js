/** Local number: digits only (no country code). */
export function sanitizePhoneDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

/** E.g. "+91" and "9876543210" → "+91 9876543210" */
export function formatFullPhone(countryCode, localNumber) {
  const code = String(countryCode || "").trim();
  const digits = sanitizePhoneDigits(localNumber);
  if (!code || !digits) return "";
  return `${code} ${digits}`;
}

export function isValidLocalPhone(digits) {
  const len = sanitizePhoneDigits(digits).length;
  return len >= 7 && len <= 12;
}

export function isValidFullPhone(fullPhone) {
  const compact = String(fullPhone || "").replace(/\s/g, "");
  return /^\+[0-9]{10,16}$/.test(compact);
}
