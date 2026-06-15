import PlanDescription from "../models/PlanDescription.js";
import Recommendation from "../models/Recommendation.js";
import SearchQuery from "../models/SearchQuery.js";
import SubscriptionLog from "../models/SubscriptionLog.js";

export async function searchPlans(query) {
  const normalized = query.trim().toLowerCase();
  const matchingPlans = await PlanDescription.find({
    $text: { $search: normalized },
  }).limit(20);

  return matchingPlans.map((plan) => ({
    planId: plan.planId,
    name: plan.name,
    description: plan.description,
  }));
}

export async function saveSearchQuery(payload) {
  const searchQuery = new SearchQuery(payload);
  return searchQuery.save();
}

export async function getRecommendations() {
  return Recommendation.find().sort({ score: -1 }).limit(15);
}

export async function logSubscriptionAction(event) {
  const log = new SubscriptionLog(event);
  return log.save();
}

export async function loadInitialContent() {
  const existing = await PlanDescription.countDocuments();
  if (existing > 0) {
    return;
  }

  const plans = [
    { planId: "netflix-mobile", name: "Netflix Mobile", description: "Mobile-only Netflix plan with on-the-go streaming." },
    { planId: "netflix-standard", name: "Netflix Standard", description: "HD streaming on two devices with full Netflix library." },
    { planId: "netflix-premium", name: "Netflix Premium", description: "Ultra HD streaming for up to four devices." },
    { planId: "spotify-premium", name: "Spotify Premium", description: "Ad-free music, offline listening, and premium sound quality." },
    { planId: "amazon-prime", name: "Amazon Prime", description: "Prime video, shipping benefits, music, and more in one membership." },
    { planId: "disney-plus", name: "Disney+", description: "Family-friendly streaming from Disney, Pixar, Marvel, and Star Wars." },
    { planId: "youtube-premium", name: "YouTube Premium", description: "Ad-free YouTube, background play, and YouTube Music." },
    { planId: "chatgpt-plus", name: "ChatGPT Plus", description: "Priority AI access and advanced features for creators and teams." },
    { planId: "microsoft-365", name: "Microsoft 365", description: "Office apps, cloud storage, and collaboration tools for business." },
    { planId: "adobe-creative-cloud", name: "Adobe Creative Cloud", description: "Design, video, photo, and web creation tools." },
  ];

  await PlanDescription.insertMany(plans);
  await Recommendation.insertMany([
    { planId: "chatgpt-plus", title: "AI Productivity Boost", description: "Recommended for power users looking to amp up productivity.", score: 100, tags: ["AI", "Productivity"] },
    { planId: "netflix-premium", title: "Best for Entertainment", description: "Top recommendation for families and streaming enthusiasts.", score: 90, tags: ["Streaming", "Family"] },
    { planId: "spotify-premium", title: "Music Lovers", description: "Great for listeners who want offline playback and ad-free music.", score: 85, tags: ["Music", "Audio"] },
  ]);
}
