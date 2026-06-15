# SubscriptionHub AI Search Service

Microservice for AI-powered search and recommendations.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your MongoDB Atlas connection string.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Endpoints

- `GET /health`
- `GET /search?q=...`
- `POST /search`
- `GET /search/recommendations`
- `POST /search/seed`
