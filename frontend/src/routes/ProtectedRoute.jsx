import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredRole } from "../utils/normalizeRole";

const ProtectedRoute = ({ adminOnly = false, userOnly = false }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = getStoredRole();

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/" />;
  }

  if (!role) {
    localStorage.clear();
    return <Navigate replace to="/" />;
  }

  if (adminOnly && role !== "ADMIN") {
    return <Navigate replace to="/dashboard" />;
  }

  if (userOnly && role !== "USER") {
    return <Navigate replace to="/admin" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
