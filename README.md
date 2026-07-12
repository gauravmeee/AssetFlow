# AssetFlow

AssetFlow is a full-stack asset management application for tracking assets, allocations, bookings, departments, categories, and user roles.

## Features

- User authentication and role-based access
- Asset registration and inventory tracking
- Allocation and return workflows
- Booking management for shared resources
- Organization setup for departments and categories
- Dashboard summary with operational metrics
- AI-assisted features via the server integration

## Project structure

- `clients/` – React + Vite frontend
- `server/` – Express + MongoDB backend

## Requirements

- Node.js 18+
- npm 9+
- MongoDB connection string

## Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd clients
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../server
   npm install
   ```
4. Create a `.env` file in the server folder with your MongoDB URI and any required API keys.

## Running the app

### Backend

```bash
cd server
npm run dev
```

The backend runs on `http://localhost:4000` by default.

### Frontend

```bash
cd clients
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment variables

The server expects at least:

- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – JWT signing secret (optional, defaults are available)
- `GEMINI_API_KEY` – for AI-related features

## API overview

Key backend routes include:

- `/auth/login` and `/auth/signup`
- `/assets`
- `/allocations`
- `/bookings`
- `/departments`
- `/categories`
- `/dashboard/summary`

## Notes

- The app uses a MongoDB database for persistent storage.
- The frontend communicates with the backend through the Vite API base URL configured in the client environment.

## License

This project is for internal/demo use unless otherwise specified.
