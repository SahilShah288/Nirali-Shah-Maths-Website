import { useState } from "react";
import {
  createAdminSession,
  validateAdminPassword,
} from "../utils/adminSession";

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = validateAdminPassword(password);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    createAdminSession();
    onSuccess();
  };

  return (
    <div className="premium-card mx-auto max-w-sm animate-fade-in">
      <h2 className="font-display text-center text-xl font-semibold text-midnight sm:text-2xl">
        Admin Login
      </h2>
      <p className="mt-2 text-center text-sm text-slate-600">
        Enter the dashboard password to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div>
          <label className="premium-label">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="premium-input"
          />
        </div>
        <button type="submit" className="btn-primary w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}
