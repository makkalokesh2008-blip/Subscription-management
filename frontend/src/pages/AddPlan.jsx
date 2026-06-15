import { useState } from "react";
import { FaLayerGroup, FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../utils/api";

const AddPlan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    duration: "",
    benefits: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/plans", {
        planName: formData.planName,
        name: formData.planName,
        price: formData.price,
        duration: formData.duration,
        duration_days: Number(formData.duration),
        benefits: formData.benefits,
        description: formData.benefits
      });
      alert("Plan added successfully");
      navigate("/plans");
    } catch (err) {
      console.log(err);
      setError(getApiError(err, "Failed to add plan."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="page-hero glass-panel">
        <div>
          <span className="eyebrow">Admin tools</span>
          <h1>Add new plan</h1>
          <p>Create a polished subscription offer for customers to compare and buy.</p>
        </div>
      </div>

      <div className="form-shell glass-panel">
        <div className="form-intro">
          <div className="form-icon">
            <FaLayerGroup />
          </div>
          <h2>Plan details</h2>
          <p className="muted-text">Keep the details simple, clear, and conversion friendly.</p>
        </div>

        <form className="modern-form" onSubmit={handleSubmit}>
          {error && <div className="alert-banner alert-danger">{error}</div>}

          <label>
            <span>Plan Name</span>
            <input
              name="planName"
              onChange={handleChange}
              placeholder="Premium Monthly"
              required
              type="text"
              value={formData.planName}
            />
          </label>

          <div className="form-grid-2">
            <label>
              <span>Price</span>
              <input
                name="price"
                onChange={handleChange}
                placeholder="999"
                required
                type="number"
                value={formData.price}
              />
            </label>

            <label>
              <span>Duration</span>
              <input
                name="duration"
                onChange={handleChange}
                placeholder="1"
                required
                type="number"
                value={formData.duration}
              />
            </label>
          </div>

          <label>
            <span>Benefits</span>
            <textarea
              name="benefits"
              onChange={handleChange}
              placeholder="Unlimited access, priority support, premium content"
              rows="5"
              value={formData.benefits}
            />
          </label>

          <button className="btn btn-primary-gradient" disabled={loading} type="submit">
            <FaPlus />
            <span>{loading ? "Adding..." : "Add Plan"}</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddPlan;
