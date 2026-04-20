# KrishiEaze Web App

Frontend application for the KrishiEaze platform. It helps farmers and buyers access mandi rates, manage listings, track orders, and maintain profile/location data through a responsive React interface.

## Table of Contents

- [Overview](#overview)
- [Feature Highlights](#feature-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Routes and Access Control](#routes-and-access-control)
- [API Integration Map](#api-integration-map)
- [State Management](#state-management)
- [Styling, Theme, and i18n](#styling-theme-and-i18n)
- [Build and Preview](#build-and-preview)
- [Troubleshooting](#troubleshooting)
- [Current Limitations](#current-limitations)

## Overview

The app is built with React + Vite and uses Redux Toolkit for auth/profile state. Authentication is OTP-based, protected routes are enforced via a `PrivateRoute` wrapper, and user session state is persisted via `localStorage`.

Default local development behavior:

- Dev server runs at `http://localhost:3000`
- API requests target `http://localhost:8080`
- Auth token is sent as `Authorization: Bearer <token>`
- Cookies are sent with API requests (`withCredentials: true`)

## Feature Highlights

- OTP login/signup flow (mobile number + OTP verification)
- Profile onboarding and profile update
- Farmer dashboard with:
  - sales summary (from sell requests)
  - recent transactions
  - sell request card
  - weather widget (location-aware)
- Mandi price search for nearby markets by crop
- Sell produce workflow with mandi selection
- Order history view
- Theme switcher (light/dark mode)
- Language switcher (`en`, `hi`, `mr`)
- Responsive layout with sidebar (desktop) and bottom nav (mobile)

## Tech Stack

- React 19
- React Router DOM 7
- Redux Toolkit + React Redux
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Axios
- i18next + react-i18next + language detector

## Project Structure

```text
web-app/
|-- Public/
|   |-- Logo_No_text.png
|   |-- KrishiEaze_logo_default.png
|   `-- KrishiEaze_logo_light.png
|-- src/
|   |-- api/
|   |   `-- index.js              # Axios client + endpoint wrappers
|   |-- auth/
|   |   `-- authSlice.js          # Auth/profile thunks + reducers
|   |-- components/
|   |   |-- Navbar.jsx
|   |   |-- Sidebar.jsx
|   |   |-- MobileBottomNav.jsx
|   |   |-- WeatherWidget.jsx
|   |   `-- ...
|   |-- pages/
|   |   |-- Landing.jsx
|   |   |-- Login.jsx
|   |   |-- Signup.jsx
|   |   |-- Dashboard.jsx
|   |   |-- MandiPrices.jsx
|   |   |-- SellProduce.jsx
|   |   |-- OrderDetails.jsx
|   |   `-- Profile.jsx
|   |-- App.jsx                   # Route definitions + lazy loading
|   |-- i18n.js                   # Translation resources
|   |-- index.css                 # Tailwind + CSS variables
|   `-- index.jsx                 # App bootstrap
|-- store.js                      # Redux store
|-- tailwind.config.js
|-- vite.config.js
`-- package.json
```

## Getting Started

### Prerequisites

- Node.js `18+` (recommended `20+`)
- npm `9+`
- Running backend API (default expected at `http://localhost:8080`)

### Install and run

```bash
cd web-app
npm install
npm run dev
```

Open `http://localhost:3000`.

### Available scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build in `dist/`
- `npm run preview` - preview production build locally

## Configuration

### API base URL

The API URL is currently hardcoded in `src/api/index.js`:

```js
const API_BASE_URL = 'http://localhost:8080';
```

If your backend runs elsewhere, update this value.

### Client-side persistence

- `localStorage.accessToken` - JWT/access token used by Axios interceptor
- `localStorage.theme` - theme preference (`light` or `dark`)

### Browser permissions

For best results, allow location permission in the browser:

- Profile page: syncs GPS coordinates to backend (`/api/v1/location/update-location`)
- Weather widget: uses user GPS/profile coordinates; falls back to Delhi coordinates

## Routes and Access Control

Public routes:

- `/` - landing page
- `/login` - login via OTP
- `/signup` - signup + profile completion

Protected routes (require authentication):

- `/dashboard`
- `/mandi`
- `/sell`
- `/orders`
- `/profile`

Unknown routes redirect to `/`.

## API Integration Map

Defined in `src/api/index.js`.

### Auth

- `POST /auth/signup-request`
- `POST /auth/verify-otp`
- `POST /auth/refresh`

### Profile

- `GET /api/v1/profile/me`
- `PUT /api/v1/profile/update`

### Farmer

- `POST /api/v1/listings/create`
- `GET /api/v1/listings/farmer`
- `DELETE /api/v1/listings/:id`

### Buyer

- `GET /api/v1/listings/all`
- `POST /api/v1/orders/create`
- `GET /api/v1/orders/buyer`

### Location

- `POST /api/v1/location/update-location`

### Mandi and Sell Requests

- `GET /api/v1/mandi/nearest?crop=<name>`
- `POST /api/v1/mandi/sell-request`
- `GET /api/v1/mandi/sell-request/my-requests`

### Transport

- `POST /api/v1/transport/calculate`

Note: Not all wrappers are currently wired to UI screens yet, but the client methods are ready.

## State Management

Redux store is configured in `store.js` with one slice:

- `auth` slice (`src/auth/authSlice.js`)

Main async thunks:

- `requestOtpThunk`
- `verifyOtpThunk`
- `fetchProfileThunk`
- `updateProfileThunk`

Main reducers:

- `logout`
- `clearError`

## Styling, Theme, and i18n

- Tailwind CSS is used with custom CSS variables in `src/index.css`.
- Theme is class-based (`dark` on `document.documentElement`).
- Translation resources are in `src/i18n.js`.
- Supported language codes:
  - `en` (English)
  - `hi` (Hindi)
  - `mr` (Marathi)

## Build and Preview

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Troubleshooting

### API calls fail with `401` or `403`

- Verify backend is running and reachable.
- Re-login to refresh `accessToken` in local storage.
- Confirm backend accepts `Authorization: Bearer <token>`.

### CORS or cookie issues

- Backend must allow frontend origin (`http://localhost:3000` by default).
- Since `withCredentials: true` is enabled, backend CORS must allow credentials.

### Empty dashboard/order sections

- Dashboard cards depend on `/api/v1/mandi/sell-request/my-requests`.
- Create a sell request first from `/sell`.

### Weather or mandi location mismatch

- Sync GPS from Profile page.
- Grant browser location permission.

### Character encoding looks broken

- Ensure files are saved in UTF-8 encoding.

## Current Limitations

- No automated test/lint scripts configured yet.
- API base URL is hardcoded (not environment-driven yet).
- Some UI elements are placeholders (for example, image upload in Sell Produce form).
- Some API wrappers are prepared but not yet fully consumed in pages.
