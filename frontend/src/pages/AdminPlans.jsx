import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import api, { getApiError } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/plans');
      setPlans(res.data);
    } catch (err) {
      setError(getApiError(err, "Failed to load plans"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/plans/${id}`);
      setPlans(plans.filter(p => p.id !== id));
    } catch (err) {
      alert(getApiError(err, "Failed to delete plan"));
    }
  };

  const toggleStatus = async (plan) => {
    const newStatus = plan.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.put(`/plans/${plan.id}`, { ...plan, status: newStatus });
      setPlans(plans.map(p => p.id === plan.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert(getApiError(err, "Failed to update plan status"));
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Master Plans</h1>
          <p>Manage subscription plans across the platform.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/add-plan")}>
          <FaPlus /> New Master Plan
        </button>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}><LoadingSpinner label="Loading plans..." /></div>
        ) : plans.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No plans found. Create one to get started.</div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Price / Mo</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{plan.name}</td>
                  <td style={{ padding: '1rem' }}>{plan.category}</td>
                  <td style={{ padding: '1rem' }}>₹{plan.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="status-badge" style={{ background: plan.status === 'ACTIVE' ? 'var(--accent-green)' : 'var(--bg-tertiary)', color: plan.status === 'ACTIVE' ? 'white' : 'inherit' }}>
                      {plan.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleStatus(plan)} className="btn btn-ghost" title={plan.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} style={{ padding: '0.5rem' }}>
                      {plan.status === 'ACTIVE' ? <FaTimes color="var(--accent-danger)" /> : <FaCheck color="var(--accent-green)" />}
                    </button>
                    <button onClick={() => navigate(`/edit-plan/${plan.id}`)} className="btn btn-ghost" title="Edit Plan" style={{ padding: '0.5rem' }}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="btn btn-ghost" title="Delete Plan" style={{ padding: '0.5rem', color: 'var(--accent-danger)' }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPlans;
