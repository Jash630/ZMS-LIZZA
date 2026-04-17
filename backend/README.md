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
- If both are missing, production-safe defaults are used:
   - `https://zmslizzafrontend.vercel.app`
   - `https://zmslizzaadmin.vercel.app`

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

Seed credentials are environment-driven and not hardcoded in source anymore.

Optional variables you can set in `.env` before seeding:

- `SEED_SUPERADMIN_EMAIL`, `SEED_SUPERADMIN_PASSWORD`
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
- `SEED_EDITOR_EMAIL`, `SEED_EDITOR_PASSWORD`
- `SEED_INACTIVE_EDITOR_EMAIL`, `SEED_INACTIVE_EDITOR_PASSWORD`

If password variables are not set, strong random passwords are generated during `npm run seed` and printed once in the terminal.

## Production Password Rotation (Non-Destructive)

Use this when your live credentials were previously exposed. This updates only matching user passwords and does not delete content data.

1. Set one or more target emails (required):
   - `ROTATE_SUPERADMIN_EMAIL`
   - `ROTATE_ADMIN_EMAIL`
   - `ROTATE_EDITOR_EMAIL`
2. Set passwords if you want fixed values (optional):
   - `ROTATE_SUPERADMIN_PASSWORD`
   - `ROTATE_ADMIN_PASSWORD`
   - `ROTATE_EDITOR_PASSWORD`
3. Run:
   - `npm run rotate:admin-passwords`

Notes:

- If a password variable is omitted for a provided email, a strong random password is generated and printed once in terminal output.
- Existing JWT sessions are invalidated because `passwordChangedAt` is updated.
- Users not found by email are reported and skipped.
