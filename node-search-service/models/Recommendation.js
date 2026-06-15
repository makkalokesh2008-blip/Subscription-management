import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  planId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  score: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recommendation", recommendationSchema);
