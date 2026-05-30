import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import {
  clearAdminSession,
  isAdminSessionValid,
} from "../utils/adminSession";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(isAdminSessionValid);

  const syncSession = useCallback(() => {
    setAuthenticated(isAdminSessionValid());
  }, []);

  useEffect(() => {
    syncSession();
    const onStorage = (e) => {
      if (e.key === null || e.key.includes("nirali_admin_session")) {
        syncSession();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncSession]);

  const handleLogout = () => {
    clearAdminSession();
    setAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
