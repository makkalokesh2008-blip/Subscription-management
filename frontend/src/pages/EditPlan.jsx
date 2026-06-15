import { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import api, { getApiError } from "../utils/api";
import { getPlanBenefits, getPlanDuration, getPlanName } from "../utils/data";

const EditPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    planName: "",
    price: "",
    duration: "",
    benefits: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/plans/${id}`)
      .then((res) => {
        const plan = res.data || {};
        setFormData({
          planName: getPlanName(plan),
          price: plan.price || "",
          duration: getPlanDuration(plan),
          benefits: getPlanBenefits(plan)
        });
      })
      .catch((err) => {
        console.log(err);
        setError(getApiError(err, "Unable to load plan details."));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/plans/${id}`, {
        planName: formData.planName,
        name: formData.planName,
        price: formData.price,
        duration: formData.duration,
        duration_days: Number(formData.duration),
        benefits: formData.benefits,
        description: formData.benefits
      });
      alert("Plan updated successfully");
      navigate("/plans");
    } catch (err) {
      console.log(err);
      setError(getApiError(err, "Failed to update plan."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-stack">
      <div className="page-hero glass-panel">
        <div>
          <span className="eyebrow">Admin tools</span>
          <h1>Edit plan</h1>
          <p>Update pricing, duration, and customer-facing benefits.</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading plan" />
      ) : (
        <div className="form-shell glass-panel">
          <div className="form-intro">
            <div className="form-icon">
              <FaPenToSquare />
            </div>
            <h2>Update details</h2>
            <p className="muted-text">Changes will be reflected on the plans page.</p>
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

            <button className="btn btn-primary-gradient" disabled={saving} type="submit">
              <FaPenToSquare />
              <span>{saving ? "Updating..." : "Update Plan"}</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default EditPlan;
