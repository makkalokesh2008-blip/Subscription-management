import React, { useState, useEffect } from 'react';
import api, { getApiError } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaBan, FaSearch, FaFilter } from 'react-icons/fa';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscriptions/platform/all');
      setSubscriptions(res.data);
    } catch (err) {
      setError(getApiError(err, "Failed to load subscriptions"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      const sub = subscriptions.find(s => s.id === id);
      await api.put(`/subscriptions/${id}`, { ...sub, status: 'CANCELLED' });
      setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, status: 'CANCELLED' } : s));
    } catch (err) {
      alert(getApiError(err, "Failed to cancel subscription"));
    }
  };

  const filteredSubs = subscriptions.filter(s => {
    const matchesSearch = s.serviceName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions.filter(s => s.status === 'ACTIVE').length;
  const cancelledCount = subscriptions.filter(s => s.status === 'CANCELLED').length;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Subscription Management</h1>
          <p>View and manage all active and inactive subscriptions across the platform.</p>
        </div>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-blue)' }}>{subscriptions.length}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Subscriptions</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-green)' }}>{activeCount}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Active</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-danger)' }}>{cancelledCount}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Cancelled</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by service name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          />
        </div>
        <div style={{ width: '200px', position: 'relative' }}>
          <FaFilter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', appearance: 'none' }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem' }}><LoadingSpinner label="Loading subscriptions..." /></div>
        ) : filteredSubs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No subscriptions found.</div>
        ) : (
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Service</th>
                <th style={{ padding: '1rem' }}>User ID</th>
                <th style={{ padding: '1rem' }}>Cost</th>
                <th style={{ padding: '1rem' }}>Cycle</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{sub.serviceName}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.userId}</td>
                  <td style={{ padding: '1rem' }}>₹{sub.monthlyCost}</td>
                  <td style={{ padding: '1rem' }}>{sub.billingCycle}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="status-badge" style={{ background: sub.status === 'ACTIVE' ? 'var(--accent-green)' : 'var(--bg-tertiary)', color: sub.status === 'ACTIVE' ? 'white' : 'inherit' }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {sub.status === 'ACTIVE' && (
                      <button onClick={() => handleCancel(sub.id)} className="btn btn-ghost" title="Cancel Subscription" style={{ padding: '0.5rem', color: 'var(--accent-danger)' }}>
                        <FaBan /> Cancel
                      </button>
                    )}
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

export default AdminSubscriptions;
