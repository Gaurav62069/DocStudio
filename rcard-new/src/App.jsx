import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CardGenerator from "./pages/CardGenerator";
import Login from "./pages/Login";
import Pending from "./pages/Pending"; // Ye wahi WhatsApp wala page hai jo upar diya tha
import AdminDashboard from "./pages/AdminDashboard";
// Security Wrapper: Bina login wale CardGenerator access na kar payein
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;
  if (!user.isApproved) return <Navigate to="/pending" />;

  return children;
};
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;
  if (user.role !== "admin") return <Navigate to="/generator" />;

  return children;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pending" element={<Pending />} />
        <Route
          path="/generator"
          element={
            <ProtectedRoute>
              <CardGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
