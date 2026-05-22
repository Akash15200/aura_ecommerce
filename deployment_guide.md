# Deployment Guide: Aura E-Commerce Platform (Frontend-Only)

This guide outlines how to run and deploy the **Aura Frontend** in its fully self-contained offline mock mode. All backend functionalities, databases, review sentiment analysis, recommendations, and chatbot layers are mocked directly inside the browser using local storage state persistence.

---

## 1. Local Development Setup

To run the application locally on your machine:

1. Clone or navigate to the project directory.
2. Run the main project startup script:
   ```bash
   ./run_project.sh
   ```
   *Note: This script checks for node dependencies, installs them automatically if missing, and starts the Vite development server.*
3. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 2. Production Deployment on Vercel

Vercel provides seamless deployment for modern React apps. Since the project is frontend-only, you don't need any backend hosting or external database instances.

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Select your imported GitHub repository.
3. Configure the Project parameters:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select the **`frontend`** directory.
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Deploy**. Vercel will build the frontend and serve it at a public `https://*.vercel.app` domain.

---

## 3. Mock Capabilities Included

The frontend includes offline implementations of:
- **Authentication**: Register customer accounts, login with credentials, simulate email OTP code validation (default: `123456`), and forgot/reset password steps.
- **Catalog Management**: Live category and product listing, price range filtering, custom sorting, and pagination.
- **Cart & Wishlist**: Real-time state syncing with local storage, instant cart slides, and automated subtotal calculation.
- **Loyalty Rewards**: 5% cashback accumulation as gold points on checkout, and optional checkout points redemption at $0.10 per point.
- **Reviews & AI Sentiment**: Real-time review submissions with automatic keyword-based sentiment tag classification (POSITIVE, NEUTRAL, NEGATIVE).
- **AI Recommendation Feed**: Dynamically calculated similarity feeds based on overlap tag matching and category association.
- **Cognitive AI Chatbot**: Interactive chatbot popups answering inquiries, detailing promo codes (`WELCOME10`, `MINIMALIST`, `AURA50`), and attaching actionable product cards.
- **Admin Control Room**: Full dashboard analytics (revenue ledger, average order value, transaction counts) and AI linear regression forecasts, plus forms to create new products and category collections.
