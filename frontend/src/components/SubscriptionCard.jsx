import { FaCheck, FaStar } from "react-icons/fa6";
import { getPlanBenefits, getPlanName } from "../utils/data";

const SubscriptionCard = ({ plan }) => {
  return (
    <article className="pricing-card accent-blue">
      <div className="pricing-card-top">
        <span className="pricing-label">
          <FaStar />
          Premium
        </span>
      </div>

      <h2>{getPlanName(plan)}</h2>

      <div className="price-row">
        <span>Rs.</span>
        <strong>{plan.price}</strong>
      </div>

      <ul className="feature-list">
        <li>
          <FaCheck />
          {getPlanBenefits(plan) || "Premium subscription benefits"}
        </li>
      </ul>

      <button className="btn btn-primary-gradient w-100" type="button">
        Subscribe
      </button>
    </article>
  );
};

export default SubscriptionCard;
