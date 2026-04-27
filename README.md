# 🌍 Polylingo – Learn Polish with AI

Polylingo is an AI-powered language learning assistant that helps users learn **Polish** in a fun and interactive way. It translates English sentences into Polish, pronounces the translated sentence with TTS, and even teaches you a new **Polish Word of the Day** — all in one place!

![Polylingo Logo](https://your-image-url-here.com) <!-- Optional: Add a banner or logo image -->

---

## ✨ Features

- 🔁 Real-time translation of English to Polish
- 🗣️ Text-to-Speech (TTS) for Polish pronunciation
- 📅 Daily Polish word with translation and usage
- ⚡ Built with Google Gemini API
- 🧠 AI-enhanced learning experience
- 🖥️ Simple and sleek web UI using **Streamlit**

---

## Required environment variables

Create a `backend/.env` (do NOT commit it).

```
MONGO_URI=your_mongo_uri
OPENAI_API_KEY=your_openai_api_key
PORT=5000
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
FRONTEND_URL=http://localhost:3000
```

How to generate secure secrets (recommended):

- Node (cross-platform):

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

- PowerShell:

```powershell
[System.Convert]::ToHexString((New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes(48)).ToLower()
```

Paste each generated string into `JWT_SECRET` and `REFRESH_TOKEN_SECRET`.

`FRONTEND_URL` should be the origin where your frontend runs (example: `http://localhost:3000` for React dev).

---

## API reference (backend)

Base URL (local): `http://localhost:5000`

- POST `/api/auth/register`
  - Body: `{ "username", "email", "password" }`
  - Response: `{ message, token, refreshToken, user }` (201)

- POST `/api/auth/login`
  - Body: `{ "email", "password" }`
  - Response: `{ message, token, refreshToken, user }` (200)

- POST `/api/auth/refresh`
  - Body: `{ "refreshToken" }` — rotates refresh token and returns new tokens.

- POST `/api/auth/logout`
  - Body: `{ "refreshToken" }` — revokes the stored session.

- GET `/api/auth/me`
  - Protected — returns current user (requires `Authorization: Bearer <accessToken>`).

- GET `/api/users`
  - Returns sanitized user list (for testing/admin).

- POST `/api/ai/chat`
  - Protected. Body: `{ "message", "language" }`.
  - Response: `{ reply }`.
  - Stores user and assistant messages in `Conversation` for that user+language.

- GET `/api/conversations`
  - Protected. Query params: `language` (optional), `page` (default 1), `limit` (default 20).
  - Response: `{ conversations: [ { id, language, lastMessage, messageCount, updatedAt } ] }`.

- GET `/api/conversations/:id`
  - Protected. Query params: `page` (page of messages, default 1), `limit` (messages per page, default 100).
  - Response: `{ conversation: { id, language, messages: [...], total } }` — messages are returned most-recent-first pagination.

Authentication: All protected routes require the header `Authorization: Bearer <accessToken>`.

---

## Database notes

- Collections used: `users`, `sessions`, `conversations` (created automatically when first written).
- Indexes declared in models:
  - `Session` has a TTL index on `expiresAt` (so expired sessions are removed automatically).
  - `Conversation` has a compound index `{ user: 1, language: 1, updatedAt: -1 }` for fast lookups.
- On startup the backend attempts to sync model indexes automatically. See `backend/index.js` (it calls `Model.syncIndexes()` after connecting).

If your Mongo user cannot create indexes, create them manually (mongosh):

```js
use <your_db>
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.conversations.createIndex({ user: 1, language: 1, updatedAt: -1 })
```

---

## Testing & CI

- Run locally:

```cmd
cd backend
npm test
```

- CI: A workflow `nodejs-backend-tests.yml` runs `npm test` in `backend` on push/PR to `main`. The workflow file is at `.github/workflows/nodejs-backend-tests.yml`.

When running tests locally make sure `JWT_SECRET` and `REFRESH_TOKEN_SECRET` are set (tests also provide fallbacks in `jest.setup.js` when missing).

### CI / GitHub Secrets

The CI workflow reads sensitive values from your repository Secrets. Add the following secrets in the GitHub repository settings → Secrets & variables → Actions:

- `MONGO_URI` — (optional for tests) your MongoDB connection string for integration tests. Not required for unit tests.
- `OPENAI_API_KEY` — the OpenAI API key if any integration tests require it. Tests have a safe fallback, but set it for parity with production.
- `JWT_SECRET` — the access-token signing secret used by the backend.
- `REFRESH_TOKEN_SECRET` — the refresh-token signing secret used by the backend.

How to add secrets:

1. Open your repository on GitHub.
2. Go to `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.
3. Use the names above and paste the secret values (generated as recommended earlier).

Notes:

- The workflow will use the secrets if present. If you do not set them, the test suite has local fallbacks for some values (see `backend/jest.setup.js`), but it's best practice to configure the real values for CI.
- For production CI runs that exercise real DB or external APIs, store production secrets in the repository or organization secrets and protect them (branch protections, limited access).
- Do NOT commit secrets into the repo; use GitHub Secrets only.

---

## Frontend integration checklist

- Store access token (short-lived) in memory or secure storage and attach `Authorization: Bearer <token>` when calling protected routes.
- Use refresh token flow to obtain new access tokens via `POST /api/auth/refresh` when access tokens expire.
- Chat flow:
  - POST `/api/ai/chat` with `{ message, language }` — append user's message to UI, show loading, then append AI reply.
  - Fetch conversation summaries via `GET /api/conversations` to show conversation list.
  - Fetch messages for a conversation via `GET /api/conversations/:id?page=1&limit=100`.

Example fetch call (JS/fetch):

```js
fetch('/api/conversations', { headers: { Authorization: `Bearer ${token}` }})
  .then(r => r.json())
  .then(data => console.log(data.conversations))
```

---

## Security & deployment notes

- Do not commit `backend/.env`. Use platform environment variables (Render, Heroku, Vercel, AWS, Azure) in production.
- Rotate `REFRESH_TOKEN_SECRET` or `JWT_SECRET` if they become compromised.
- Limit `FRONTEND_URL` in CORS to your frontend origin.
