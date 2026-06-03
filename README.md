# VibeMatch 🌸

Describe someone — get the perfect opening message and song recommendations to send them.

## Features

- Generate warm, witty, and curious opening messages via Gemini AI
- Get song recommendations with Spotify and YouTube links
- Shareable vibe links (`/share/:id`)
- Romantic or friendship connection modes

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Shruti2301/VibeMatch.git
cd VibeMatch
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

Copy the example env file and fill in your keys:

```bash
cp backend/.env.example backend/.env
```

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com/apikey) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `GEMINI_MODEL` | Default: `gemini-2.5-flash` |
| `PORT` | Default: `3001` |

### 3. Supabase table

Create a `vibes` table with columns: `id` (uuid), `name`, `description`, `interests`, `connection_type`, `profile_link`, `tags` (jsonb), `result` (jsonb), `created_at`.

### 4. Run locally

**Option A — both servers:**

```bash
npm run dev
```

**Option B — separate terminals:**

```bash
cd backend && npm start
cd frontend && npm run dev
```

Open http://localhost:5173

## Tech stack

- **Frontend:** React + Vite
- **Backend:** Express + Gemini AI + Supabase
