import mongoose from "mongoose";

const planEmbeddingSchema = new mongoose.Schema({
  planId: { type: String, required: true, index: true },
  embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PlanEmbedding", planEmbeddingSchema);
