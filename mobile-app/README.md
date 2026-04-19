# Welcome to your KrishiEaze App 👋

## Introduction
KrishiEaze is an agricultural mobile application designed to empower farmers and agricultural stakeholders by providing a unified platform to manage profiles, discover the nearest mandis (markets) for specific crops, and manage agricultural listings. The app features robust OTP-based authentication, multilingual support, and real-time location-based services to connect users with the right opportunities.

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Project Structure & Activities](#project-structure--activities)
- [API Integration & Data Fetching](#api-integration--data-fetching)

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### 1. Install dependencies
```bash
npm install
```

### 2. Start the App
To start the Expo development server, run:
```bash
npm start
```
Alternatively, you can run the app for specific platforms using the following commands:
```bash
npm run android   # Start on Android emulator
npm run ios       # Start on iOS simulator
npm run web       # Start in web browser
```

In the output, you'll find options to open the app in a development build, Android emulator, iOS simulator, or Expo Go.

## Project Structure & Activities

This app utilizes [Expo Router](https://docs.expo.dev/router/introduction) for file-based routing. The main screens (activities) are located in the `app` directory:

### Authentication Flow (`app/(auth)`)
- **`login.tsx`**: The initial authentication screen where users enter their mobile number to request an OTP.
- **`otp.tsx`**: The verification screen where users input the received OTP to authenticate.
- **`register.tsx`**: If a user is new, they are redirected here to complete their profile setup after OTP verification.

### Main Application Tabs (`app/(tabs)`)
- **`index.tsx` (Home)**: The main dashboard providing an overview of features. It integrates location services and displays the nearest mandis.
- **`listings.tsx`**: Displays the active agricultural listings associated with the user or market.
- **`orders.tsx`**: A dedicated screen to view and track transaction orders.
- **`profile.tsx`**: Allows users to view and update their personal information and preferences.

### Additional Screens
- **`create-listing.tsx`**: A dedicated screen to create new crop listings for the market.

## API Integration & Data Fetching

The application communicates with a Spring Boot backend. The API configuration and all endpoints are centralized in `app/services/api.ts`. Fetching is handled via a custom wrapper over the standard `fetch` API, automatically managing Base URLs (switching between local network for development and production URLs), JSON parsing, and custom error handling (`ApiError`).

Here are the primary endpoints and how data is passed:

### Authentication
- **Request OTP** (`/auth/signup-request`):
  - **Method**: `POST`
  - **Body**: `{ "mobileNo": "string", "role": "FARMER" }`
  - **Action**: Triggers an OTP SMS to the provided mobile number.
- **Verify OTP** (`/auth/verify-otp`):
  - **Method**: `POST`
  - **Body**: `{ "mobileNo": "string", "otp": "string" }`
  - **Action**: Verifies the OTP and returns authentication tokens (Access & Refresh tokens).
- **Refresh Token** (`/auth/refresh`):
  - **Method**: `POST`
  - **Headers**: `Authorization: Bearer <refreshToken>`
  - **Action**: Exchanges an expired access token for a new one.

### User Profile
- **Get Profile** (`/api/v1/profile/me`):
  - **Method**: `GET`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Action**: Fetches the currently authenticated user's profile details.
- **Update Profile** (`/api/v1/profile/update`):
  - **Method**: `PUT`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Body**: Custom profile data object (e.g., name, address).
  - **Action**: Updates the user's profile information.

### Location & Mandis
- **Update Location** (`/api/v1/location/update-location`):
  - **Method**: `POST`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Body**: `{ "lat": number, "lng": number }`
  - **Action**: Syncs the user's current GPS coordinates with the backend.
- **Get Nearest Mandis** (`/api/v1/mandi/nearest`):
  - **Method**: `GET`
  - **Query Params**: `crop=cropName`
  - **Headers**: `Authorization: Bearer <accessToken>`
  - **Action**: Fetches a list of nearby mandis filtered by the specified crop.
