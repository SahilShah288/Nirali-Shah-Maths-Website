import { Navigate, useLocation } from "react-router-dom";
import { isStudentSessionValid } from "../utils/studentSession";

export default function ProtectedStudentRoute({ children }) {
  const location = useLocation();

  if (!isStudentSessionValid()) {
    return (
      <Navigate
        to="/book-slot/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
