import mongoose from "mongoose";

const searchQuerySchema = new mongoose.Schema({
  query: { type: String, required: true, index: true },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} },
  results: { type: [mongoose.Schema.Types.Mixed], default: [] },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("SearchQuery", searchQuerySchema);
