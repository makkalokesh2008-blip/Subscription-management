import mongoose from "mongoose";

const subscriptionLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  planId: { type: String, required: true },
  action: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SubscriptionLog", subscriptionLogSchema);
