import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaChartPie, FaDatabase, FaLayerGroup, FaRobot } from "react-icons/fa6";

const Landing = () => {
  const features = [
    {
      title: "AI Recommendations",
      desc: "Smart insights that identify duplicate subscriptions and suggest better alternatives.",
      icon: <FaRobot />
    },
    {
      title: "Full Analytics",
      desc: "Deep insights into your monthly spend with forecasting and predictive models.",
      icon: <FaChartPie />
    },
    {
      title: "Enterprise Architecture",
      desc: "Powered by Spring Boot, Python FastAPI Gateway, and MongoDB Atlas.",
      icon: <FaDatabase />
    },
    {
      title: "Unified Dashboard",
      desc: "See every subscription, payment history, and renewal date in one elegant interface.",
      icon: <FaLayerGroup />
    }
  ];

  return (
    <div className="landing-hero bg-grid">
      <div className="glow-effect"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ zIndex: 10, textAlign: 'center' }}
      >
        <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}>
          Introducing SubscriptionHub Enterprise
        </span>
        
        <h1 className="text-gradient">
          Subscription Intelligence <br />
          <span className="text-gradient-primary">Reimagined.</span>
        </h1>
        
        <p style={{ margin: '0 auto 2.5rem', fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          Stop guessing where your money goes. Unify your subscriptions, analyze your spend, 
          and let our AI gateway optimize your digital footprint.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyItems: 'center', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Start Building <FaArrowRight />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            View Dashboard
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="glass-panel"
        style={{ marginTop: '5rem', padding: '3rem', width: '100%', maxWidth: '1000px', zIndex: 10 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
            >
              <div style={{ fontSize: '1.5rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
