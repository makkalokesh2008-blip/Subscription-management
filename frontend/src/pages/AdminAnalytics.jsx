import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import api, { getApiError } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminAnalytics = () => {
  const [data, setData] = useState({
    users: [], plans: [], subscriptions: [], payments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [usersRes, plansRes, subsRes, paymentsRes] = await Promise.all([
          api.get('/users'),
          api.get('/plans'),
          api.get('/subscriptions/platform/all'),
          api.get('/payments')
        ]);
        setData({
          users: usersRes.data || [],
          plans: plansRes.data || [],
          subscriptions: subsRes.data || [],
          payments: paymentsRes.data || []
        });
      } catch (err) {
        setError(getApiError(err, "Failed to load analytics data"));
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Process data for charts
  const revenueByMonth = data.payments.reduce((acc, p) => {
    const month = new Date(p.paymentDate).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (p.amount || 0);
    return acc;
  }, {});
  const revenueData = Object.keys(revenueByMonth).map(month => ({ name: month, revenue: revenueByMonth[month] }));
  if (revenueData.length === 0) revenueData.push({ name: 'No Data', revenue: 0 });

  const subsByMonth = data.subscriptions.reduce((acc, s) => {
    const month = new Date(s.createdAt || new Date()).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const subsGrowthData = Object.keys(subsByMonth).map(month => ({ name: month, subscriptions: subsByMonth[month] }));
  if (subsGrowthData.length === 0) subsGrowthData.push({ name: 'No Data', subscriptions: 0 });

  const planDistribution = data.subscriptions.reduce((acc, s) => {
    const planName = s.serviceName || 'Unknown';
    acc[planName] = (acc[planName] || 0) + 1;
    return acc;
  }, {});
  const planPieData = Object.keys(planDistribution).map(name => ({ name, value: planDistribution[name] }));
  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#3b82f6'];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Deep dive into platform metrics and performance.</p>
        </div>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div className="glass-panel" style={{ padding: '4rem' }}><LoadingSpinner label="Compiling analytics..." /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Revenue Growth</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent-green)" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Subscription Growth</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subsGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} cursor={{fill: 'var(--bg-tertiary)'}} />
                  <Bar dataKey="subscriptions" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Plan Distribution</h3>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Platform Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Registered Users</span>
                <strong style={{ fontSize: '1.2rem' }}>{data.users.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Master Plans</span>
                <strong style={{ fontSize: '1.2rem' }}>{data.plans.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Payments Processed</span>
                <strong style={{ fontSize: '1.2rem' }}>{data.payments.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Subscriptions</span>
                <strong style={{ fontSize: '1.2rem' }}>{data.subscriptions.filter(s => s.status === 'ACTIVE').length}</strong>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;
