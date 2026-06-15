import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaChartPie, FaCreditCard, FaLayerGroup, FaMagnifyingGlass, FaRegRectangleList, FaArrowRightFromBracket, FaUser, FaRobot } from "react-icons/fa6";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <FaLayerGroup />
        <span>SubscriptionHub</span>
      </div>

      <nav className="nav-links">
        {role === "USER" && (
          <>
            <span className="nav-section-title">Main</span>
            <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
              <FaChartPie /> Dashboard
            </Link>
            <Link to="/plans" className={`nav-item ${isActive("/plans") ? "active" : ""}`}>
              <FaRegRectangleList /> Browse Plans
            </Link>
            <Link to="/payments" className={`nav-item ${isActive("/payments") ? "active" : ""}`}>
              <FaCreditCard /> My Payments
            </Link>
            <Link to="/search" className={`nav-item ${isActive("/search") ? "active" : ""}`}>
              <FaMagnifyingGlass /> Search Engine
            </Link>
            <Link to="/recommendations" className={`nav-item ${isActive("/recommendations") ? "active" : ""}`}>
              <FaRobot /> AI Insights
            </Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <span className="nav-section-title">Administration</span>
            <Link to="/admin" className={`nav-item ${isActive("/admin") ? "active" : ""}`}>
              <FaChartPie /> Dashboard
            </Link>
            <Link to="/admin/users" className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}>
              <FaUser /> Users
            </Link>
            <Link to="/admin/plans" className={`nav-item ${isActive("/admin/plans") ? "active" : ""}`}>
              <FaRegRectangleList /> Plans
            </Link>
            <Link to="/admin/subscriptions" className={`nav-item ${isActive("/admin/subscriptions") ? "active" : ""}`}>
              <FaLayerGroup /> Subscriptions
            </Link>
            <Link to="/admin/payments" className={`nav-item ${isActive("/admin/payments") ? "active" : ""}`}>
              <FaCreditCard /> Platform Payments
            </Link>
            <Link to="/admin/analytics" className={`nav-item ${isActive("/admin/analytics") ? "active" : ""}`}>
              <FaChartPie /> Analytics
            </Link>
            <Link to="/admin/settings" className={`nav-item ${isActive("/admin/settings") ? "active" : ""}`}>
              <FaRobot /> Settings
            </Link>
          </>
        )}
        
        <div style={{ flex: 1 }}></div>

        <span className="nav-section-title">Account</span>
        <div className="nav-item" style={{ color: 'var(--text-secondary)' }}>
           {email || "User"}
        </div>
        <button className="nav-item btn-ghost" style={{ width: '100%', border: 'none', justifyContent: 'flex-start' }} onClick={handleLogout}>
          <FaArrowRightFromBracket /> Sign Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
