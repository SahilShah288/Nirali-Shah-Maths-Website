import axios from "axios";
import {
  getConfiguredAdminKey,
  isAdminSessionValid,
} from "../utils/adminSession";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Axios config for protected admin routes.
 * Requires a valid admin session and sends x-admin-key from VITE_ADMIN_API_KEY.
 */
export function withAdminKey() {
  if (!isAdminSessionValid()) {
    throw new Error("Admin session expired. Please sign in again at /admin.");
  }

  const key = getConfiguredAdminKey();
  if (!key) {
    throw new Error("VITE_ADMIN_API_KEY is not configured.");
  }

  return {
    headers: {
      "x-admin-key": key,
    },
  };
}

export default api;
