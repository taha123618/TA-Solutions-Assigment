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

## 🚀 Quick Start (Single Command)

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

## 💻 Manual Setup & Execution

### 1. Backend (`ta-solution-backend`)
```bash
cd ta-solution-backend

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### 2. Frontend (`ta-solution-frontend`)
```bash
cd ta-solution-frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## ⚙️ Environment Variables

The backend configuration is managed via `ta-solution-backend/.env`:

```env
PORT=3000
CURRENCY_API_KEY=
```

> **Note**: You can update `CURRENCY_API_KEY` in `ta-solution-backend/.env` anytime to use a new key from [freecurrencyapi.com](https://freecurrencyapi.com).

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

---

## 📂 Project Structure

```
TA-Solutions-Assignment/
├── package.json                       # Monorepo runner (concurrently scripts)
├── .gitignore                         # Root git ignore rules
├── .mcp.json                          # MCP Server configuration
├── README.md
├── ta-solution-backend/               # NestJS API Gateway Application
│   ├── src/
│   │   ├── currency/                  # Currency service, controller & tests
│   │   ├── app.module.ts              # Root module with ConfigModule
│   │   └── main.ts                    # Bootstrap, CORS & Swagger setup
│   ├── .env                           # Environment configuration
│   └── .agents/skills/                # Backend agent skill documentation
└── ta-solution-frontend/              # React 19 + Vite + Bootstrap Application
    ├── src/
    │   ├── api/                       # Axios API client functions
    │   ├── components/                # React functional components (Converter, History, Common)
    │   ├── hooks/                     # TanStack React Query hooks
    │   ├── store/                     # Zustand stores with LocalStorage persistence
    │   ├── types/                     # TypeScript type definitions
    │   └── main.tsx                   # QueryClientProvider & React root
    └── .agents/skills/                # Frontend agent skill documentation
```
