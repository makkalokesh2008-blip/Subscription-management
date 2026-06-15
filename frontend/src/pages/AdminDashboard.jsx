import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCrown, FaMoneyBillWave, FaChartPie, FaPlus } from "react-icons/fa6";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api, { getApiError } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, plansRes, paymentsRes, subsRes] = await Promise.all([
          api.get("/users"),
          api.get("/plans"),
          api.get("/payments"),
          api.get("/subscriptions")
        ]);

        const users = usersRes.data || [];
        const plans = plansRes.data || [];
        const payments = paymentsRes.data || [];
        const subscriptions = subsRes.data || [];

        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const activeSubscribers = subscriptions.filter(s => s.status === 'ACTIVE').length;

        // Group payments by month for real chart data
        const revenueByMonth = payments.reduce((acc, p) => {
          const date = new Date(p.paymentDate);
          const month = date.toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (p.amount || 0);
          return acc;
        }, {});
        
        const chartData = Object.keys(revenueByMonth).map(month => ({
          name: month,
          revenue: revenueByMonth[month]
        }));
        
        // Ensure at least some data points for chart to render nicely even if empty
        if (chartData.length === 0) {
          chartData.push({ name: 'No Data', revenue: 0 });
        }

        setData({
          users,
          plans,
          payments,
          subscriptions,
          totalRevenue,
          activeSubscribers,
          chartData
        });
      } catch (err) {
        console.error(err);
        setError(getApiError(err, "Failed to load admin data."));
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Platform Administration</h1>
          <p>System overview, user management, and revenue analytics.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/add-plan")}>
          <FaPlus /> New Master Plan
        </button>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

      {loading || !data ? (
        <LoadingSpinner label="Compiling system data..." />
      ) : (
        <>
          <div className="stats-grid">
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-blue">
              <div className="stat-icon"><FaUsers /></div>
              <span>Total Users</span>
              <strong>{data.users.length}</strong>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-purple">
              <div className="stat-icon"><FaCrown /></div>
              <span>Active Plans</span>
              <strong>{data.plans.length}</strong>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-green">
              <div className="stat-icon"><FaMoneyBillWave /></div>
              <span>Total Revenue</span>
              <strong>₹{data.totalRevenue.toFixed(0)}</strong>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-pink">
              <div className="stat-icon"><FaChartPie /></div>
              <span>Total Subscriptions</span>
              <strong>{data.subscriptions.length}</strong>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-blue">
              <div className="stat-icon"><FaCrown /></div>
              <span>Total Payments</span>
              <strong>{data.payments.length}</strong>
            </motion.div>
            <motion.div whileHover={{ y: -5 }} className="stat-card stat-green">
              <div className="stat-icon"><FaUsers /></div>
              <span>Active Subscribers</span>
              <strong>{data.activeSubscribers}</strong>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Revenue Analytics</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--text-secondary)" fontSize={12} dy={10} />
                    <YAxis tickLine={false} axisLine={false} stroke="var(--text-secondary)" fontSize={12} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent-green)" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent Users</h3>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {data.users.slice(0, 5).map((u) => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {u.name?.charAt(0) || u.email?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{u.name || "User"}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                      </div>
                    </div>
                    <span className="status-badge" style={{ background: 'var(--bg-tertiary)' }}>{u.role || 'USER'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
