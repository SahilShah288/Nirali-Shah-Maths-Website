const SESSION_STORAGE_KEY = "nirali_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Expected admin password / API key from Vite env.
 */
export function getConfiguredAdminKey() {
  const key = import.meta.env.VITE_ADMIN_API_KEY;
  return typeof key === "string" && key.length > 0 ? key : null;
}

/**
 * Validate login password against VITE_ADMIN_API_KEY (strict equality).
 */
export function validateAdminPassword(password) {
  const expected = getConfiguredAdminKey();

  if (!expected) {
    return {
      ok: false,
      error: "Admin access is not configured (VITE_ADMIN_API_KEY).",
    };
  }

  if (password !== expected) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  return { ok: true };
}

/**
 * Create an authenticated admin session after successful login.
 */
export function createAdminSession() {
  const session = {
    v: 1,
    sid: crypto.randomUUID(),
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

/**
 * Whether the current browser session is authenticated and not expired.
 */
export function isAdminSessionValid() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;

    const session = JSON.parse(raw);
    if (
      session?.v !== 1 ||
      typeof session.sid !== "string" ||
      typeof session.expiresAt !== "number"
    ) {
      return false;
    }

    if (Date.now() >= session.expiresAt) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch {
    clearAdminSession();
    return false;
  }
}

/**
 * Clear admin session on logout or expiry.
 */
export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
