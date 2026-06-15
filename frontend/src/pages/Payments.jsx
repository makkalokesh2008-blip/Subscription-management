import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaReceipt } from "react-icons/fa6";
import api, { getApiError } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments/me");
      setPayments(res.data || []);
    } catch (err) {
      console.error(err);
      setError(getApiError(err, "Failed to load payments."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleCreatePayment = async () => {
    const serviceName = prompt("Enter subscription name:");
    if (!serviceName) return;
    const amount = parseFloat(prompt("Enter payment amount:"));
    try {
      await api.post("/payments", { serviceName, amount, status: "COMPLETED" });
      fetchPayments();
    } catch (err) {
      alert("Failed to create payment record");
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1>Payment History</h1>
          <p>Track all your past transactions and upcoming renewals.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreatePayment}>
          <FaPlus /> Create Payment Record
        </button>
      </div>

      {error && <div className="glass-panel" style={{ color: 'var(--accent-danger)', padding: '1rem', marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading payments..." />
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {payments.length > 0 ? (
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const dateObj = new Date(p.paymentDate || p.createdAt || Date.now());
                    const formattedDate = dateObj.toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    });
                    
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FaReceipt color="var(--text-secondary)" />
                            </div>
                            <span style={{ fontWeight: 500 }}>{p.serviceName}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{formattedDate}</td>
                        <td style={{ fontWeight: 600 }}>₹{p.amount?.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${p.status === 'COMPLETED' ? 'status-success' : 'status-warning'}`}>
                            {p.status || "COMPLETED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No payments found</h3>
              <p>Your payment history will appear here once transactions are recorded.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
