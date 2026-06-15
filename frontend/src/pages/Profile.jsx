import { FaEnvelope, FaPen, FaRightFromBracket, FaShieldHalved, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getStoredRole } from "../utils/normalizeRole";

const Profile = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const email = localStorage.getItem("email") || "account@subscription.app";
  const role = getStoredRole();
  const firstLetter = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <section className="profile-page page-stack">
      <div className="profile-card glass-panel">
        <div className="profile-banner" />

        <div className="profile-main">
          <div className="profile-avatar avatar">{firstLetter}</div>
          <h1>{name}</h1>
          <p>{email}</p>
          <span className={`role-pill ${role === "ADMIN" ? "role-admin" : "role-user"}`}>
            {role}
          </span>
        </div>

        <div className="profile-info-grid">
          <article className="info-card">
            <div className="info-icon">
              <FaUser />
            </div>
            <span>Name</span>
            <strong>{name}</strong>
          </article>

          <article className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <span>Email</span>
            <strong>{email}</strong>
          </article>

          <article className="info-card">
            <div className="info-icon">
              <FaShieldHalved />
            </div>
            <span>Role</span>
            <strong>{role}</strong>
          </article>
        </div>

        <div className="profile-actions">
          <button className="btn btn-ghost" type="button">
            <FaPen />
            <span>Edit Profile</span>
          </button>

          <button className="btn btn-danger-soft" onClick={handleLogout} type="button">
            <FaRightFromBracket />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
