import { FaBars, FaBell, FaCreditCard, FaRightFromBracket } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "USER";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="top-navbar">
      <div className="nav-brand-wrap">
        <button
          aria-label="Open navigation"
          className="icon-button mobile-menu-button"
          onClick={onMenuClick}
          type="button"
        >
          <FaBars />
        </button>

        <div className="brand-mark">
          <FaCreditCard />
        </div>

        <div>
          <p className="brand-kicker">SubscriptionHub</p>
          <h1 className="brand-title">Premium SaaS</h1>
        </div>
      </div>

      <div className="nav-actions">
        <button aria-label="Notifications" className="icon-button" type="button">
          <FaBell />
        </button>

        <div className="nav-user">
          <span className="nav-user-label">Logged in as</span>
          <strong>{name}</strong>
          <span className={`nav-user-role ${role === "ADMIN" ? "role-admin" : "role-user"}`}>{role}</span>
        </div>

        <button className="btn btn-danger-soft" onClick={logout} type="button">
          <FaRightFromBracket />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
