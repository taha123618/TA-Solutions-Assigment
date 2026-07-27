---
name: currency-frontend-app
description: React functional component architecture, TanStack React Query, Axios API client, Zustand state stores, and Bootstrap UI.
---

# Currency Frontend Application Skill

This skill documents the component structure, state management, custom hooks, data fetching, and styling patterns for `ta-solution-frontend`.

## Architecture & Technology Stack
- **Core Framework**: React 19 + TypeScript (Vite)
- **API Client & Caching**: `@tanstack/react-query` v5 + `axios`
- **State Management**: `zustand` (with `persist` middleware)
- **UI Framework & Styling**: Bootstrap 5 + Vanilla CSS glassmorphism styling

## Directory Structure
```
ta-solution-frontend/
├── src/
│   ├── api/
│   │   └── currencyApi.ts          # Axios API client (fetchCurrenciesApi, convertCurrencyApi)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx          # Application header & status indicator
│   │   │   ├── Footer.tsx          # Application footer
│   │   │   └── index.tsx           # Common components index export
│   │   ├── CurrencyConverter.tsx   # Mobile-first converter UI card
│   │   └── ConversionHistory.tsx   # Persistent conversion log card
│   ├── hooks/
│   │   ├── useCurrenciesQuery.ts   # TanStack React Query hook for supported currencies
│   │   └── useConvertMutation.ts   # TanStack React Query mutation hook for conversions
│   ├── store/
│   │   ├── useConverterStore.ts    # Zustand store for converter inputs & UI actions
│   │   └── useHistoryStore.ts      # Zustand store with LocalStorage persistence
│   ├── types/
│   │   └── currency.ts             # TypeScript interfaces
│   ├── App.css                     # Component layout styles
│   ├── App.tsx                     # Main page layout container
│   ├── index.css                   # Custom design tokens, glassmorphism & gradients
│   └── main.tsx                    # QueryClientProvider & React root mount point
├── .mcp.json                       # MCP Server configuration
├── package.json
└── vite.config.ts
```

## State & Data Flow

### 1. `useConverterStore` (Zustand)
- Stores active inputs: `amount`, `fromCurrency`, `toCurrency`, `isHistorical`, `historicalDate`.
- Actions: `setAmount`, `setFromCurrency`, `setToCurrency`, `setIsHistorical`, `setHistoricalDate`, `swapCurrencies`, `applyPreset`.

### 2. `useHistoryStore` (Zustand + `persist`)
- Stores user conversion history in `localStorage` under `currency_conversion_history_v2`.
- Actions: `addHistoryItem`, `deleteHistoryItem`, `clearHistory`.
- Automatically retains logs across browser reloads.

### 3. TanStack React Query (`useCurrenciesQuery`, `useConvertMutation`)
- `useCurrenciesQuery`: Fetches supported currencies metadata with 30-minute stale time caching via Axios.
- `useConvertMutation`: Executes conversion requests via Axios and automatically dispatches new conversion results to `useHistoryStore`.

## Features
- **Functional Components Only**: Built strictly using React functional components and custom hooks.
- **Dynamic Currency Dropdowns**: Dynamically populated for both From & To ends with quick currency swap button.
- **Quick Amount Presets**: Instant amount pills (`$10`, `$50`, `$100`, `$500`, `$1000`).
- **Historical Rate Mode**: Toggle switch & datepicker input for historical exchange rates.
- **Persistent Conversion History**: Recorded entries with date & time timestamps, clear all, single delete, and reuse actions.
- **Mobile-First Responsive Layout**: Optimized for mobile viewports using Bootstrap grid and custom glassmorphism card components.

## Commands

```bash
# Start frontend development server
npm run dev

# Run ESLint check
npm run lint

# Build for production
npm run build
```
