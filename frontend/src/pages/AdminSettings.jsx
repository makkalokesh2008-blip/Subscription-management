import React, { useState, useEffect } from 'react';
import api, { getApiError } from '../utils/api';
import { FaServer, FaDatabase, FaCodeBranch, FaShieldAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({
    gateway: 'Checking...',
    backend: 'Checking...',
    database: 'Checking...',
    version: '1.0.0-rc.1'
  });

  useEffect(() => {
    const checkSystemHealth = async () => {
      try {
        setLoading(true);
        // Assuming we can check backend health by pinging an open or authenticated endpoint
        await api.get('/plans'); 
        setStatus(prev => ({
          ...prev,
          gateway: 'Online',
          backend: 'Online',
          database: 'Connected'
        }));
      } catch (err) {
        setStatus(prev => ({
          ...prev,
          gateway: 'Unreachable',
          backend: 'Error',
          database: 'Unknown'
        }));
      } finally {
        setLoading(false);
      }
    };
    checkSystemHealth();
  }, []);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p>Platform configuration and system health.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaShieldAlt style={{ color: 'var(--accent-blue)' }} /> Platform Configuration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Platform Name</label>
              <input type="text" defaultValue="SubscriptionHub" className="form-input" disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Admin Email Contact</label>
              <input type="email" defaultValue="admin@subscriptionhub.com" className="form-input" disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} />
            </div>
            <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>Save Changes</button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaServer style={{ color: 'var(--accent-green)' }} /> System Health
          </h3>
          
          {loading ? (
            <LoadingSpinner label="Running diagnostics..." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCodeBranch style={{ color: 'var(--text-secondary)' }} />
                  <span>FastAPI Gateway</span>
                </div>
                <strong style={{ color: status.gateway === 'Online' ? 'var(--accent-green)' : 'var(--accent-danger)' }}>{status.gateway}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaServer style={{ color: 'var(--text-secondary)' }} />
                  <span>Spring Boot Backend</span>
                </div>
                <strong style={{ color: status.backend === 'Online' ? 'var(--accent-green)' : 'var(--accent-danger)' }}>{status.backend}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaDatabase style={{ color: 'var(--text-secondary)' }} />
                  <span>MongoDB Atlas</span>
                </div>
                <strong style={{ color: status.database === 'Connected' ? 'var(--accent-green)' : 'var(--accent-danger)' }}>{status.database}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>System Version</span>
                <strong>{status.version}</strong>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
