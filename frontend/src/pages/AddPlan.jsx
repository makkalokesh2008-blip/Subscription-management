import { useState } from "react";
import { FaLayerGroup, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../utils/api";

const AddPlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    duration: "",
    benefits: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/plans", {
        planName: formData.planName,
        name: formData.planName,
        price: formData.price,
        duration: formData.duration,
        duration_days: Number(formData.duration),
        benefits: formData.benefits,
        description: formData.benefits
      });
      alert("Plan added successfully");
      navigate("/admin/plans");
    } catch (err) {
      console.log(err);
      setError(getApiError(err, "Failed to add plan."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent-blue)' }}>Admin Tools</span>
          <h1 style={{ marginTop: '0.5rem' }}>Add New Plan</h1>
          <p>Create a polished subscription offer for customers to compare and buy.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
            <FaLayerGroup color="var(--accent-purple)" size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Plan Details</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Keep the details simple, clear, and conversion friendly.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && <div style={{ padding: '1rem', background: 'rgba(238,0,0,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', border: '1px solid rgba(238,0,0,0.2)' }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Plan Name</label>
            <input
              name="planName"
              onChange={handleChange}
              placeholder="e.g. Premium Monthly"
              required
              type="text"
              value={formData.planName}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Price (₹)</label>
              <input
                name="price"
                onChange={handleChange}
                placeholder="e.g. 999"
                required
                type="number"
                value={formData.price}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Duration (Days)</label>
              <input
                name="duration"
                onChange={handleChange}
                placeholder="e.g. 30"
                required
                type="number"
                value={formData.duration}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Benefits</label>
            <textarea
              name="benefits"
              onChange={handleChange}
              placeholder="e.g. Unlimited access, Priority support, Premium content"
              rows="4"
              value={formData.benefits}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn btn-primary" disabled={loading} type="submit" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
              <FaPlus />
              <span>{loading ? "Adding..." : "Add Plan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlan;
