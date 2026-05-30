import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import EnquiryPage from "./pages/EnquiryPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EnquiryPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  );
}
