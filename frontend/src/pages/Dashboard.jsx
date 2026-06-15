import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaChartLine,
  FaCrown,
  FaLayerGroup,
} from "react-icons/fa6";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import api, { getApiError } from "../utils/api";
import { getStoredRole } from "../utils/normalizeRole";

const Dashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const name = localStorage.getItem("name") || "User";

  const fetchData = async () => {
    try {
      const [subscriptionsRes, analyticsRes] = await Promise.all([
        api.get("/subscriptions"),
        api.get("/analytics")
      ]);

      setSubscriptions(subscriptionsRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.log(err);
      setError(getApiError(err, "Unable to load your dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeSubscriptions = subscriptions.filter((sub) => String(sub.status || "").toUpperCase() === "ACTIVE");

  const stats = [
    {
      label: "Active Plans",
      value: analytics?.totalActive || activeSubscriptions.length,
      icon: <FaLayerGroup />,
      tone: "blue"
    },
    {
      label: "Total Subscriptions",
      value: subscriptions.length,
      icon: <FaCrown />,
      tone: "purple"
    },
    {
      label: "Monthly Spending",
      value: `₹${(analytics?.monthlySpending || 0).toFixed(0)}`,
      icon: <FaChartLine />,
      tone: "green"
    },
    {
      label: "Yearly Spending",
      value: `₹${(analytics?.yearlySpending || 0).toFixed(0)}`,
      icon: <FaCalendarCheck />,
      tone: "pink"
    }
  ];

  const chartData = [
    { name: "Jan", spend: 1200 },
    { name: "Feb", spend: 1400 },
    { name: "Mar", spend: 1350 },
    { name: "Apr", spend: 1600 },
    { name: "May", spend: 1800 },
    { name: "Jun", spend: analytics?.monthlySpending || 1800 }
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Welcome back, {name}</h1>
          <p>Here is an overview of your active subscriptions and spending trends.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading dashboard data..." />
      ) : (
        <>
          {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

          <div className="stats-grid">
            {stats.map((stat) => (
              <motion.div 
                whileHover={{ y: -5 }}
                className={`stat-card stat-${stat.tone}`} 
                key={stat.label}
              >
                <div className="stat-icon">{stat.icon}</div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Active Subscriptions</h3>
              {subscriptions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {subscriptions.map((sub) => {
                    const isActive = String(sub.status || "").toUpperCase() === "ACTIVE";
                    return (
                      <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
                            <FaCrown color="var(--accent-purple)" />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.875rem' }}>{sub.serviceName}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub.category}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>₹{sub.monthlyCost}</div>
                          <span className={`status-badge ${isActive ? "status-success" : "status-warning"}`} style={{ fontSize: '0.65rem' }}>
                            {sub.status || "ACTIVE"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No active subscriptions found.</p>
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Spending Trend</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="var(--text-secondary)" fontSize={12} dy={10} />
                    <YAxis tickLine={false} axisLine={false} stroke="var(--text-secondary)" fontSize={12} dx={-10} />
                    <Tooltip 
                      formatter={(value) => `₹${value}`} 
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="var(--accent-blue)" strokeWidth={2} fillOpacity={1} fill="url(#spendGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
