import { useState } from "react";
import { motion } from "framer-motion";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import api, { getApiError } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(true);
    
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Search failed."));
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ paddingBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Global Search Engine</h1>
        <p style={{ maxWidth: '500px', margin: '0 auto' }}>
          Search across the entire platform for subscriptions, plans, or specific services using our Node.js search gateway.
        </p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FaMagnifyingGlass style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search for Netflix, AWS, Spotify..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem', height: '3.5rem', fontSize: '1.125rem' }}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem', fontSize: '1rem' }} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <LoadingSpinner label="Searching the network..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {hasSearched && results.length === 0 && !error && (
            <div className="empty-state">
              <h3>No results found for "{query}"</h3>
              <p>Try searching with different keywords.</p>
            </div>
          )}

          {results.map((result) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel" 
              key={result.id || result.name}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{result.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{result.category}</span>
                  <span>•</span>
                  <span>₹{result.price}/mo</span>
                  {result.score && (
                    <>
                      <span>•</span>
                      <span>Relevance: {(result.score * 100).toFixed(0)}%</span>
                    </>
                  )}
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => handleAddSubscription(result)}>
                <FaPlus /> Add
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
