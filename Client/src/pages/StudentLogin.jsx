import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import {
  createStudentSession,
  isStudentSessionValid,
  validateStudentPassword,
} from "../utils/studentSession";

export default function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const from = location.state?.from?.pathname || "/book-slot";

  if (isStudentSessionValid()) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);

    const result = validateStudentPassword(password);
    if (!result.ok) {
      setError(result.error);
      setVerifying(false);
      return;
    }

    createStudentSession();
    navigate(from, { replace: true });
  };

  return (
    <section className="mx-auto max-w-lg animate-fade-in">
      <div className="premium-card">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-cerulean ring-1 ring-blue-100">
          <Lock className="h-7 w-7" aria-hidden />
        </div>

        <h1 className="font-display text-center text-2xl font-semibold text-midnight sm:text-3xl">
          Current Students Only
        </h1>
        <p className="mt-4 text-center text-base leading-relaxed text-slate-600">
          This feature is reserved for currently enrolled students. Please enter
          the password provided in class to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div
              className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="student-password" className="premium-label">
              Student password
            </label>
            <input
              id="student-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={verifying}
            className="btn-primary w-full"
          >
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </form>
      </div>
    </section>
  );
}
