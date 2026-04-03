# ZMS LIZZA Admin Dashboard

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   - `npm install`
3. Start admin app:
   - `npm run dev`

## Environment Variables

- `VITE_API_BASE_URL`
  - Example: `http://localhost:5000/api/v1`

## Local Run Sequence

1. Start backend first:
   - In `backend/`: `npm run dev`
2. Start admin:
   - In `admin/`: `npm run dev`

## Seed Credentials (Development)

- `superadmin@zmslizza.com / super123`
- `admin@zmslizza.com / admin123`
- `editor@zmslizza.com / editor123`
