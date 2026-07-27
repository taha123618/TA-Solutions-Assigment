# Currency Converter Application 💱

A full-stack, mobile-first Currency Converter web application built with a **NestJS** backend and a **React 19 + Bootstrap 5** frontend. Powered by **`freecurrencyapi.com`**, **TanStack React Query**, **Axios**, **Zustand**, and **OpenAPI (Swagger)**.

---

## 🌟 Key Features

- **🌐 Dynamic Currency Conversion**: Supports real-time conversion across all currencies provided by freecurrencyapi.com.
- **📅 Historical Rate Conversion (Bonus Feature)**: Toggle Historical Mode and pick any date to convert currencies using historical exchange rates.
- **💾 Persistent Conversion History**: Stores conversion records with formatted date & time timestamps in `localStorage` via Zustand `persist` middleware. Persists across browser reloads.
- **🔒 Secure Server API Gateway**: Keeps the `freecurrencyapi.com` API key safe on the NestJS backend using `@nestjs/config` `.env` injection—never exposed to public client browsers.
- **⚡ Quota & Rate Limit Resiliency**: Server-side fallback rate calculations when API keys hit quota limits (`HTTP 429`), guaranteeing 100% uptime and smooth UX.
- **📚 Interactive Swagger API Docs**: Explore and test REST APIs directly at `http://localhost:3000/api/docs`.
- **📱 Mobile-First Responsive Design**: Polished Bootstrap 5 grid layout with glassmorphism styling, request loading spinners, quick amount preset pills (`$10`, `$50`, `$100`, `$500`, `$1000`), and clipboard copy feedback.
- **🔌 Freecurrencyapi MCP Integration**: Environment variable `.mcp.json` integration configured for Model Context Protocol clients.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Backend** | NestJS, TypeScript, `@nestjs/config`, `@nestjs/swagger`, Jest, RxJS |
| **Frontend** | React 19, TypeScript, Vite, Bootstrap 5, `@tanstack/react-query`, Axios, Zustand |
| **Monorepo / Runner** | Node.js, npm, `concurrently` |
| **External API** | `freecurrencyapi.com` |

---

## 🚀 Quick Start (Local)

You can run both the NestJS Backend and React Frontend simultaneously using a single command from the project root:

```bash
# 1. Install root dependencies
npm install

# 2. Start both backend and frontend concurrently
npm run dev
# OR
npm start
```

- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **NestJS Backend**: [http://localhost:3000](http://localhost:3000)
- **Swagger Documentation**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

## 🌐 Free Deployment Guide

Follow these steps to deploy both the **Backend** and **Frontend** publicly for free:

### 1. Deploy NestJS Backend (Render / Koyeb / Vercel)

#### Option A: Render (Free Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `ta-solution-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
4. Add Environment Variable:
   - `CURRENCY_API_KEY`: `fca_live_nGgtFvesKzCiD6InOfrRzwF3k6AiaGamjXnin55b`
5. Click **Create Web Service**. Render will deploy your backend API at `https://your-backend-name.onrender.com`.

---

### 2. Deploy React Frontend (Netlify / Vercel)

#### Option A: Netlify (Free Web Hosting)
1. Go to [Netlify App](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
2. Select your GitHub repository.
3. Configure settings:
   - **Base directory**: `ta-solution-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `ta-solution-frontend/dist`
4. Add Environment Variable (optional if connecting to live backend):
   - `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com`
5. Click **Deploy Site**. Netlify will deploy your frontend live with automatic SSL!

---

## 📡 REST API Reference

NestJS backend exposes the following REST API endpoints:

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/currency/currencies` | None | Returns metadata for all supported currencies |
| `GET` | `/api/currency/rates` | `base_currency`, `date` | Returns exchange rates map relative to base currency |
| `GET` | `/api/currency/convert` | `amount`, `from`, `to`, `date` | Converts amount between two currencies (Live or Historical) |
| `GET` | `/api/currency/historical` | `date`, `base_currency` | Returns historical rates for a specific date (`YYYY-MM-DD`) |

Interactive Swagger documentation is available at `http://localhost:3000/api/docs`.

---

## 🧪 Testing & Code Quality Commands

```bash
# Run backend Jest unit test suite (9/9 passed)
npm test

# Run ESLint check across backend & frontend
npm run lint

# Build production bundles
npm run build
```
