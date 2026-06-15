import { searchPlans, saveSearchQuery, getRecommendations, loadInitialContent } from "../services/searchService.js";

export async function getSearch(req, res) {
  try {
    const query = String(req.query.q || "").trim();
    const results = await searchPlans(query);
    await saveSearchQuery({ query, results, userId: req.query.userId || "anonymous" });
    res.json({ query, results });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
}

export async function postSearch(req, res) {
  try {
    const payload = req.body;
    const results = await searchPlans(payload.query || "");
    await saveSearchQuery({ query: payload.query || "", filters: payload.filters || {}, results, userId: payload.userId || "anonymous" });
    res.json({ query: payload.query, results });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
}

export async function getRecommendationsController(req, res) {
  try {
    const recommendations = await getRecommendations();
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: "Unable to load recommendations" });
  }
}

export async function initSearchContent(req, res) {
  try {
    await loadInitialContent();
    res.json({ status: "seeded" });
  } catch (error) {
    res.status(500).json({ error: "Unable to initialize search content" });
  }
}
