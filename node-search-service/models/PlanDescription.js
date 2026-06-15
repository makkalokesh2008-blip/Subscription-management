import mongoose from "mongoose";

const planDescriptionSchema = new mongoose.Schema({
  planId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

planDescriptionSchema.index({ name: 'text', description: 'text' });

export default mongoose.model("PlanDescription", planDescriptionSchema);
