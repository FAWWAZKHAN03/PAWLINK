# PawLink Backend

A real, working Express + MongoDB backend providing authentication and profile
management for the PawLink frontend.

## What's implemented

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
  - Passwords hashed with bcrypt, sessions via signed JWTs (7 day expiry)
- **Profile**:
  - `GET /api/users/profile` — fetch the logged-in user's full profile
  - `PUT /api/users/profile` — update name, email, phone, address, bio, licenseId
  - `PUT /api/users/password` — change password (requires current password)
  - `POST /api/users/avatar` — upload/replace a profile picture (multipart/form-data, field name `avatar`)
  - `DELETE /api/users/avatar` — remove the profile picture
- Uploaded images are stored on disk under `src/uploads/avatars` and served statically at `/uploads/avatars/<file>`.
- Centralized error handling for validation errors, duplicate emails, invalid tokens, and bad file uploads.

All other route/controller files in this project (rescue, adoption, donations, etc.) were left as the
original placeholder scaffolding — they were out of scope for this integration and can be built out the
same way (model → controller → route) whenever you're ready.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Make sure MongoDB is running locally, or set `MONGO_URI` in `.env` to a MongoDB Atlas connection string.
3. Copy `.env.example` to `.env` (already provided with sane local defaults) and adjust `JWT_SECRET`,
   `MONGO_URI`, and `CLIENT_URL` as needed.
4. Start the server:
   ```
   npm run dev     # with nodemon, auto-restarts on changes
   # or
   npm start
   ```
5. The API will be available at `http://localhost:5000`. Check `http://localhost:5000/health`.

## Notes

- CORS is restricted to `CLIENT_URL` (defaults to `http://localhost:3000`, matching the frontend's Vite dev server).
- Auth uses a Bearer JWT in the `Authorization` header (no cookies), so it works cleanly with the SPA frontend.
