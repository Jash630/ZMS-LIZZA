# ZMS LIZZA Admin Dashboard

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   - `npm install`
3. Start admin app:
   - `npm run dev`

## Environment Variables

- `VITE_API_BASE_URL`
   - Example: `https://zms-lizza-backend.onrender.com/api/v1`
- `VITE_PUBLIC_SITE_URL`
   - Example: `https://zmslizzafrontend.vercel.app`
- `VITE_HTTP_TIMEOUT_MS`
   - Example: `15000`

## Local Run Sequence

1. Start backend first:
   - In `backend/`: `npm run dev`
2. Start admin:
   - In `admin/`: `npm run dev`

## Seed Credentials (Development)

Credentials are defined from backend seed environment variables and are no longer stored in this repository.

Set seed values in `backend/.env` and run `npm run seed` in the backend.
If seed passwords are not provided, secure random passwords are generated and shown once in the backend seed command output.
