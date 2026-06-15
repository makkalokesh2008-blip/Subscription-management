import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaPlus, FaStar } from "react-icons/fa6";
import api, { getApiError } from "../utils/api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getStoredRole } from "../utils/normalizeRole";

const Plans = () => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = getStoredRole();

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data || []);
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Failed to load plans."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async () => {
    const name = prompt("Enter plan name:");
    if (!name) return;
    const category = prompt("Enter plan category:");
    const price = parseFloat(prompt("Enter monthly price:"));
    try {
      await api.post("/plans", { name, category, price, billingCycle: "MONTHLY", color: "#0070F3" });
      fetchPlans();
    } catch (err) {
      alert("Failed to create plan");
    }
  };

  const handleEditPlan = async (plan) => {
    const newPrice = prompt("Enter new price:", plan.price);
    if (!newPrice) return;
    try {
      await api.put(`/plans/${plan.id}`, { ...plan, price: parseFloat(newPrice) });
      fetchPlans();
    } catch (err) {
      alert("Failed to edit plan");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  const handleAddSubscription = async (plan) => {
    setAdding(plan.name);
    try {
      await api.post("/subscriptions", {
        serviceName: plan.name,
        category: plan.category,
        monthlyCost: plan.price,
        billingCycle: plan.billingCycle || "MONTHLY",
        status: "ACTIVE"
      });
      alert(`Successfully added ${plan.name} to your portfolio!`);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError(getApiError(err, "Failed to add subscription."));
    } finally {
      setAdding(null);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Available Plans</h1>
          <p>Choose from popular services or add a custom subscription to start tracking your expenses.</p>
        </div>
        {role === "ROLE_ADMIN" && (
          <button className="btn btn-primary" onClick={handleCreatePlan}>
            <FaPlus /> Create New Plan
          </button>
        )}
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading plans..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {plans.map((plan) => (
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-panel" 
              key={plan.id || plan.name}
              style={{ 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column',
                borderTop: `2px solid ${plan.color || 'var(--accent-blue)'}`
              }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="status-badge" style={{ color: plan.color || 'var(--accent-blue)', background: `rgba(255,255,255,0.05)`, border: `1px solid ${plan.color || 'var(--accent-blue)'}33` }}>
                  {plan.category || 'Subscription'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>₹</span>
                <strong style={{ fontSize: '2rem', lineHeight: 1 }}>{plan.price}</strong>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/{plan.billingCycle === "YEARLY" ? "yr" : "mo"}</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCheck color={plan.color || "var(--accent-blue)"} /> Auto-renewal tracking</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCheck color={plan.color || "var(--accent-blue)"} /> AI cost optimization</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCheck color={plan.color || "var(--accent-blue)"} /> Usage analytics</li>
              </ul>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={adding === plan.name}
                onClick={() => handleAddSubscription(plan)}
              >
                <FaPlus /> {adding === plan.name ? "Adding..." : "Add to Portfolio"}
              </button>
              
              {role === "ROLE_ADMIN" && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => handleEditPlan(plan)}>Edit</button>
                  <button className="btn btn-danger-soft" style={{ flex: 1 }} onClick={() => handleDeletePlan(plan.id)}>Delete</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
