# ResiboCash Roadmap

Receipt-scanning rewards app for Philippine retail (React Native + Express/Azure).

---

## Phase 1 — MVP (Weeks 1–4)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 1 | Connect CameraScreen to real Express API (`/api/receipts/upload`) instead of local mock | P0 | `services/api.js` currently does fake random delay |
| 2 | User authentication (phone number + OTP or email/password) | P0 | All data is currently anonymous; no user identity |
| 3 | Real OCR receipt parsing (Azure AI Document Intelligence or Google Vision) | P0 | Server returns random store/total; needs actual extraction |
| 4 | Persist state server-side (Cosmos DB) with per-user scoping | P0 | `userId` is hardcoded `'anonymous'`; in-memory fallback loses data on restart |
| 5 | Duplicate receipt detection (image hash or receipt ID check) | P1 | No guard against submitting the same receipt multiple times |
| 6 | Error boundaries + global error handling in React Native | P1 | Unhandled promise rejections can silently break point accrual |
| 7 | CI pipeline (GitHub Actions: lint + Jest tests on PR) | P1 | No automated tests exist |
| 8 | Environment config (`.env` for API base URL, not hardcoded) | P2 | Server URL must be configurable per environment |

---

## Phase 2 — Beta (Weeks 5–10)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 1 | Real rewards fulfillment integration (GCash, Maya, Globe APIs) | P0 | Redeem endpoint returns mock success; no actual credit delivered |
| 2 | User profile & settings screen (name, photo, linked accounts) | P0 | `ProfileScreen` is UI-only with no real data |
| 3 | Geolocation-based store discovery (replace hardcoded STORES list) | P1 | `HomeScreen` store circles are static |
| 4 | Push notifications (receipt approved, reward credited, promos) | P1 | No engagement loop post-scan |
| 5 | Functional search (rewards, stores, history) | P1 | Search bar in `HomeScreen` is decorative only |
| 6 | Admin dashboard (receipt review queue, fraud flags) | P1 | Manual review needed before auto-approving OCR results |
| 7 | Points expiry logic (e.g., 12-month rolling window) | P2 | No expiry model defined |

---

## Phase 3 — Production (Weeks 11–16)

| # | Task | Priority | Notes |
|---|------|----------|-------|
| 1 | App Store / Google Play submission (privacy policy, screenshots, review) | P0 | — |
| 2 | Fraud detection model (velocity checks, duplicate image similarity) | P0 | High-risk without this; users can farm points |
| 3 | A/B testing framework for promo banners and point multipliers | P1 | "2X Double Points Week" is hardcoded |
| 4 | Analytics & observability (Mixpanel/Amplitude + Azure Monitor) | P1 | Zero visibility into funnel drop-off |
| 5 | Referral system (invite friends, earn bonus points) | P1 | Growth lever for PH market |
| 6 | Offline mode with queue (scan receipt, sync when online) | P2 | Poor mobile coverage in provincial areas |
| 7 | Multi-language support (Filipino / Taglish strings) | P2 | Target market expects localized copy |

---

## Key Risks

- **OCR accuracy on crumpled/faded PH receipts** — needs local dataset for fine-tuning.
- **Azure costs** — Blob + Cosmos + AI can spike with volume; add budgets/alerts early.
- **Regulatory** — BSP e-money rules may apply if rewards are convertible to cash.
