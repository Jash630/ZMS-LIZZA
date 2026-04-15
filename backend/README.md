# ZMS LIZZA Backend

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   - `npm install`
3. Start API:
   - `npm run dev`

## Required Environment Variables

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `MAX_FILE_UPLOAD`
- `CORS_ORIGINS` (recommended, comma-separated allowlist)

Optional:
- `CLIENT_URL` (legacy fallback when `CORS_ORIGINS` is not provided)
- `VIEW_FINGERPRINT_SALT` (recommended for unique view fingerprint hashing)
- `EMAIL_APP`, `EMAIL_APP_PASS` (for newsletter and lead emails)
- `EMAIL_FROM_NAME` (display name in outgoing emails)
- `STAFF_NOTIFICATION_EMAIL` (internal email for new lead alerts)
- `API_BASE_URL` (used in unsubscribe links)

## CORS Behavior

- If `CORS_ORIGINS` is set, only those origins are allowed.
- If `CORS_ORIGINS` is missing, `CLIENT_URL` is used.
- If both are missing, local defaults are used:
  - `http://localhost:5173`
  - `http://localhost:5174`
  - `http://127.0.0.1:5173`
  - `http://127.0.0.1:5174`

## Settings API

Protected routes under `/api/v1/settings` for `admin` and `superadmin`:

- `GET /`
- `PUT /general`
- `PUT /appearance`
- `PUT /notifications`

## Public Customer APIs

Unauthenticated endpoints under `/api/v1/public`:

- `GET /posts`
- `GET /posts/:slug`
- `GET /posts/:slug/comments`
- `POST /posts/:slug/comments`
- `GET /products`
- `GET /products/:slug`
- `GET /media`
- `GET /seo`
- `GET /settings`
- `POST /leads`
- `POST /newsletter/subscribe`
- `GET /newsletter/unsubscribe?token=<token>`

## Admin Product APIs

Protected endpoints under `/api/v1/products`:

- `GET /`
- `POST /`
- `GET /:id`
- `PUT /:id`
- `DELETE /:id`
- `GET /stats`

## Seed Data

Run:

- `npm run seed`
- `npm run seed:destroy`

Default credentials:

- `superadmin@zmslizza.com / super123`
- `admin@zmslizza.com / admin123`
- `editor@zmslizza.com / editor123`
