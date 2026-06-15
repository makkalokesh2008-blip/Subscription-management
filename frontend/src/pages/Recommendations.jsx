import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBolt, FaPlus, FaRobot, FaWandMagicSparkles } from "react-icons/fa6";
import api, { getApiError } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/recommendations");
        let recs = res.data.recommendations || [];
        
        if (recs.length === 0) {
          // Fallback to general plans for onboarding
          const plansRes = await api.get("/plans");
          // Slice the first 3 active plans
          recs = (plansRes.data || [])
            .filter(p => p.status !== 'INACTIVE')
            .slice(0, 3)
            .map(p => ({
              ...p,
              matchScore: null,
              reason: "Popular Choice - Subscribe to unlock personalized AI recommendations."
            }));
        }
        setRecommendations(recs);
      } catch (err) {
        console.error(err);
        try {
           // On endpoint failure (e.g. not implemented), fallback to plans
           const fallbackRes = await api.get("/plans");
           const fallbackRecs = (fallbackRes.data || [])
            .filter(p => p.status !== 'INACTIVE')
            .slice(0, 3)
            .map(p => ({
              ...p,
              matchScore: null,
              reason: "Trending Platform Plan - AI recommendations will appear here once you build your portfolio."
            }));
           setRecommendations(fallbackRecs);
        } catch (e) {
           setError(getApiError(err, "Failed to load recommendations."));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleAddSubscription = async (plan) => {
    try {
      await api.post("/subscriptions", {
        serviceName: plan.name,
        category: plan.category,
        monthlyCost: plan.price,
        billingCycle: plan.cycle || "MONTHLY",
        status: "ACTIVE"
      });
      alert(`Successfully added ${plan.name}`);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add subscription");
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaWandMagicSparkles color="var(--accent-purple)" /> AI Insights
          </h1>
          <p>Personalized subscription recommendations based on your usage patterns and market trends.</p>
        </div>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <LoadingSpinner label="Generating AI recommendations..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {recommendations.length === 0 && !error ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <FaRobot size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
              <h3>No recommendations yet</h3>
              <p>Add more subscriptions to your portfolio so our AI can learn your preferences.</p>
            </div>
          ) : (
            recommendations.map((rec, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel" 
                key={rec.id || rec.name}
                style={{ 
                  padding: '2rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', color: 'var(--accent-purple)' }}>
                  <FaBolt />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <span className="status-badge" style={{ color: 'var(--accent-purple)', background: `rgba(121, 40, 202, 0.1)`, border: `1px solid rgba(121, 40, 202, 0.2)` }}>
                    {rec.matchScore ? `${(rec.matchScore * 100).toFixed(0)}% Match` : "Highly Recommended"}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{rec.name}</h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6, flex: 1 }}>
                  {rec.reason || `Based on your interest in ${rec.category} services, we highly recommend adding ${rec.name} to your stack.`}
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>₹</span>
                  <strong style={{ fontSize: '1.5rem', lineHeight: 1 }}>{rec.price}</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>/mo</span>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleAddSubscription(rec)}
                >
                  <FaPlus /> Add to Portfolio
                </button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
