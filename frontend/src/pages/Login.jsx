import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLayerGroup, FaArrowRight } from "react-icons/fa6";
import api from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signin", { email, password });
      
      localStorage.setItem("token", res.data.token || res.data.accessToken || "");
      localStorage.setItem("email", res.data.email || email);
      localStorage.setItem("name", res.data.username || res.data.name || "Admin User");
      const roles = res.data.roles || [];
      localStorage.setItem("role", roles.includes("ROLE_ADMIN") ? "ADMIN" : "USER");

      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-grid">
      <div className="glow-effect"></div>
      
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <FaLayerGroup size={32} color="var(--accent-blue)" style={{ margin: '0 auto 1rem' }} />
          <h1>Welcome back</h1>
          <p>Sign in to your SubscriptionHub account</p>
        </div>

        {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem' }} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"} <FaArrowRight />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--text-primary)' }}>Sign up</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
