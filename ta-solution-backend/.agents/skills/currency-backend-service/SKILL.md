---
name: currency-backend-service
description: NestJS backend currency conversion service with freecurrencyapi integration, ConfigModule, Swagger docs, rate limiting fallbacks, and unit tests.
---

# Currency Backend Service Skill

This skill documents the complete architecture, endpoints, configuration, resilience mechanism, and testing procedures for the `ta-solution-backend` NestJS application.

## Overview
The NestJS backend acts as a secure API Gateway between client applications and the external `freecurrencyapi.com` service. It keeps the private API key safe on the server side and provides rate-limit resilient conversion endpoints.

## Directory Structure
```
ta-solution-backend/
├── src/
│   ├── currency/
│   │   ├── currency.controller.ts      # REST Endpoints with Swagger annotations
│   │   ├── currency.controller.spec.ts # Controller unit tests
│   │   ├── currency.service.ts         # Freecurrencyapi integration & fallback calculations
│   │   ├── currency.service.spec.ts    # Service unit tests
│   │   └── currency.module.ts          # NestJS Module declaration
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts                   # Root Application Module with ConfigModule
│   ├── app.service.ts
│   └── main.ts                         # Bootstrap, CORS & Swagger setup
├── .env                                # Environment variables (PORT, CURRENCY_API_KEY)
├── .env.example
├── .mcp.json                           # MCP Server configuration
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## Environment Configuration
Variables managed in `.env` and injected via `@nestjs/config` `ConfigModule`:
- `PORT`: Server port (default: `3000`).
- `CURRENCY_API_KEY`: API key for `freecurrencyapi.com`.

## REST API Endpoints

### 1. Supported Currencies
- **Endpoint**: `GET /api/currency/currencies`
- **Description**: Returns map of supported currencies with symbol, name, and native symbol.

### 2. Live Exchange Rates
- **Endpoint**: `GET /api/currency/rates?base_currency=USD`
- **Query Parameters**:
  - `base_currency` (optional, default: `USD`)
  - `date` (optional, `YYYY-MM-DD` for historical rates)

### 3. Currency Conversion (Live & Historical)
- **Endpoint**: `GET /api/currency/convert?amount=100&from=USD&to=EUR&date=2023-01-01`
- **Query Parameters**:
  - `amount` (required, positive number)
  - `from` (required, e.g. `USD`)
  - `to` (required, e.g. `EUR`)
  - `date` (optional, `YYYY-MM-DD` for historical date rate)
- **Response**:
```json
{
  "amount": 100,
  "from": "USD",
  "to": "EUR",
  "date": "2026-07-27",
  "result": 87.759716,
  "rate": 0.877597,
  "timestamp": "2026-07-27T12:15:20.029Z",
  "isHistorical": false,
  "isFallback": false
}
```

### 4. Historical Exchange Rates
- **Endpoint**: `GET /api/currency/historical?date=YYYY-MM-DD&base_currency=USD`
- **Query Parameters**:
  - `date` (required, `YYYY-MM-DD`)
  - `base_currency` (optional, default: `USD`)

## OpenAPI / Swagger Documentation
Interactive Swagger UI documentation is served automatically at:
- `http://localhost:3000/api/docs`

## Quota Resiliency & Fallback Mechanism
If `freecurrencyapi.com` returns `HTTP 429 Quota Exceeded` or network errors:
1. `CurrencyService` catches the failure and logs a server warning.
2. It calculates relative rates using a fallback dataset of 33 major currencies.
3. It sets `"isFallback": true` in the response so client applications can display a fallback notice.

## Commands

```bash
# Start backend in development watch mode
npm run start:dev

# Run unit tests
npm test

# Run ESLint check
npm run lint

# Build for production
npm run build
```
