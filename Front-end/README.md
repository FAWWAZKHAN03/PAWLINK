<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/780e5137-c5fd-44b8-b943-3e79891d2e7f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Backend Integration

This app is now connected to a real Express + MongoDB backend (see the `Back-end` project) for:

- Signup / Login (`src/api/auth.js`) — real accounts, hashed passwords, JWT sessions
- Profile page (`src/components/ProfilePage.jsx`) — fetches and saves real profile data,
  including profile picture upload (`src/api/user.js`)
- Session persistence — refreshing the page keeps you logged in (validated against the backend)

**Setup:**

1. Set `VITE_API_URL` in `.env` to point at your running backend (defaults to `http://localhost:5000`).
2. Start the backend first (see `Back-end/README.md`).
3. `npm install && npm run dev` to start this frontend.
4. Sign up for a new account from the Signup screen — this creates a real user in MongoDB.
   Logging in afterwards authenticates against that real account.
5. Once logged in, click the profile icon/name in the Dashboard header (or "Profile" in the mobile nav)
   to open the Profile page, upload a picture, and edit your details — all saved to the backend.

All other dashboard features (rescue dispatch, donations, adoption listings, messaging, etc.) still use
the original mock data in `src/data.js` — only Auth and Profile were wired to the real backend per this
integration pass.
