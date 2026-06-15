import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

app.use("/search", searchRoutes);
app.get("/health", (req, res) => res.json({ status: "ok", service: "SubscriptionHub AI Search" }));

if (!mongoUri) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Search service listening on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
