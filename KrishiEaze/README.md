# KrishiEaze Backend 🌾

KrishiEaze is a Java-based Vertical SaaS platform designed to empower Indian farmers by providing real-time market data, logistics cost estimation, and a streamlined marketplace for selling crops.

## 🚀 Key Features

* **Nearest Mandi Discovery:** Automatically finds the closest agricultural markets (Mandis) based on the user's GPS coordinates using the Haversine formula.
* **Live Price Integration:** Integrates with the Government of India's Agmarknet API to fetch the most recent 'Modal Prices' for various commodities.
* **Hybrid Data Model:** Implements a "Presentation-Ready" fallback system that uses a local historical price cache (SQL-seeded) if government APIs are unresponsive.
* **Smart Transport Calculator:** Calculates round-trip logistics costs and estimated net profit based on vehicle mileage, fuel price, and current market commodity prices.
* **Farmer Marketplace:** Allows farmers to create and manage 'Sell Requests' for their produce, linking them directly to specific Mandis.
* **Secure Authentication:** OTP-based signup and login system secured with JWT (JSON Web Tokens) and custom Spring Security configurations.

## 🛠️ Tech Stack

* **Framework:** Spring Boot 3.x
* **Language:** Java 17+
* **Database:** PostgreSQL
* **Security:** Spring Security, JWT (Stateless)
* **Build Tool:** Maven
* **External APIs:** Agmarknet (Data.gov.in)

## 🏗️ Project Architecture

The backend follows a clean, decoupled architecture:
* **MandiService:** Handles all geographic calculations and external API communications.
* **TransportService:** Manages logistics math and profit calculations.
* **Custom Security:** A stateless filter chain that manages CORS for React Expo/Web frontends and handles OTP verification.

## 📡 API Endpoints (Brief)

### Authentication
- `POST /auth/signup-request` - Request OTP for mobile number.
- `POST /auth/verify-otp` - Verify OTP and receive JWT access token.

### Mandi & Market
- `GET /api/v1/mandi/nearest?crop={name}` - Find nearby mandis with live/cached prices.
- `POST /api/v1/mandi/sell-request` - Create a produce sale listing.

### Logistics (SaaS Feature)
- `POST /api/v1/transport/calculate` - Get a detailed breakdown of transport costs and net profit.

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Utpam/KrishiEaze
    ```
2.  **Database Configuration:**
    Ensure PostgreSQL is running and update `src/main/resources/application.properties` with your database credentials and Gov API key:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/krishieaze
    gov.api.key=your_api_key_here
    ```
3.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```

## 📝 License

This project is developed for educational and professional demonstration purposes under the Mumbai University NEP 2020 syllabus.