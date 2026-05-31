import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import EnquiryPage from "./pages/EnquiryPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import StudentLogin from "./pages/StudentLogin";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EnquiryPage />} />
        <Route path="/book-slot/login" element={<StudentLogin />} />
        <Route
          path="/book-slot"
          element={
            <ProtectedStudentRoute>
              <BookingPage />
            </ProtectedStudentRoute>
          }
        />
        <Route path="/booking" element={<Navigate to="/book-slot" replace />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  );
}
