import express from "express";
import { getSearch, postSearch, getRecommendationsController, initSearchContent } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", getSearch);
router.post("/", postSearch);
router.get("/recommendations", getRecommendationsController);
router.post("/seed", initSearchContent);

export default router;
