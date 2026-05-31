const SESSION_STORAGE_KEY = "nirali_student_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours (browser tab session)

export function getConfiguredStudentPassword() {
  const password = import.meta.env.VITE_STUDENT_PASSWORD;
  return typeof password === "string" && password.length > 0 ? password : null;
}

export function validateStudentPassword(password) {
  const expected = getConfiguredStudentPassword();

  if (!expected) {
    return {
      ok: false,
      error:
        "Student booking is not configured (VITE_STUDENT_PASSWORD). Please contact your tutor.",
    };
  }

  if (password !== expected) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  return { ok: true };
}

export function createStudentSession() {
  const session = {
    v: 1,
    sid: crypto.randomUUID(),
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function isStudentSessionValid() {
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
      clearStudentSession();
      return false;
    }

    return true;
  } catch {
    clearStudentSession();
    return false;
  }
}

export function clearStudentSession() {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}
