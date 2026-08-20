# Playlist — Music Playlist Manager

A minimal, full-stack playlist manager: create playlists, add songs, filter by genre, and generate an AI-written description for each playlist.

**Live demo:** _add your Vercel URL here_

---

## Features

- **Auth** — email/password signup & login (JWT-based)
- **Playlists** — create, rename, delete
- **Songs** — add, edit, delete songs within a playlist (title, artist, genre)
- **Genre filtering** — filter a playlist's songs by genre
- **AI description** — generate a short, vibe-based description for a playlist using Google Gemini, based on its songs

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS

**Backend**
- Flask (Python), organized into Blueprints
- SQLAlchemy ORM
- Flask-Bcrypt (password hashing)
- PyJWT (auth tokens)

**Database**
- PostgreSQL (hosted on [Supabase](https://supabase.com), accessed via connection pooler)

**AI**
- [Google Gemini API](https://aistudio.google.com/apikey) (`gemini-3.6-flash`) for playlist descriptions

**Deployment**
- [Vercel](https://vercel.com) — frontend (static build) + backend (Python serverless function) in a single project

---

music-playlist-manager/
├── api/                        # ONLY for Vercel Serverless Entry
│   └── index.py                # Imports your Flask app from 'backend' and runs it
│
├── backend/                    # All Flask logic lives safely here
│   ├── __init__.py             # App factory (create_app)
│   ├── extensions.py           # db, bcrypt instances
│   ├── models.py               # User, Playlist, Song
│   ├── routes/                 # auth, playlists, songs, ai
│   └── utils/                  # JWT helpers
│
├── src/                        # React Frontend Code
│   ├── main.jsx / index.js     # React entry point
│   ├── pages/                  
│   ├── components/             
│   ├── context/                
│   └── api/                    # fetch/axios client
│
├── vercel.json                 # Critical routing rules (see below)
├── requirements.txt            # Required for Vercel Python build (Flask, PyJWT, etc.)
├── package.json                # Required for Vercel React build
└── vite.config.js              # (Assuming Vite) Frontend build config

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- A [Supabase](https://supabase.com) project (Postgres)
- A free [Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd music-playlist-manager

# Frontend
npm install

# Backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r api/requirements.txt
```

### 2. Environment variables
Create a `.env` file at the project root:
```dotenv
DATABASE_URL=postgresql://<user>:<password>@<host>:6543/postgres
JWT_SECRET=your_own_random_secret
GEMINI_API_KEY=your_gemini_api_key
```
Use Supabase's **pooled** connection string (port `6543`), not the direct one — needed for serverless-friendly connection handling.

### 3. Run locally
Two terminals, both running at once:
```bash
# Terminal 1 — backend
python -m api.index

# Terminal 2 — frontend
npm run dev
```
Frontend runs on `http://localhost:5173`, proxying `/api/*` requests to Flask on `http://127.0.0.1:5000`.

---

## Deployment (Vercel)

1. Push the repo to GitHub.
2. Import the repo on [vercel.com/new](https://vercel.com/new).
3. Add the same three environment variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`) in Vercel project settings.
4. Deploy — `vercel.json` handles routing `/api/*` to the Flask function and everything else to the built frontend.

---

## Design Notes

- **Fault isolation:** every route is wrapped in try/except returning clean JSON errors; a global Flask error handler prevents any unhandled exception from crashing the whole API. Frontend pages are individually wrapped in error boundaries.
- **Scope:** intentionally excludes things not needed for a single-user, non-scaling project — no refresh-token rotation, roles/permissions, pagination, caching layer, or test suite.
- **Genres** are a fixed dropdown list rather than free text, to keep filtering reliable.

---

## Credits / Resources

- [Supabase](https://supabase.com) — hosted Postgres + connection pooling
- [Google AI Studio / Gemini API](https://aistudio.google.com) — AI-generated playlist descriptions
- [Vercel](https://vercel.com) — hosting & deployment
- [Tailwind CSS](https://tailwindcss.com) — styling
- [React Router](https://reactrouter.com) — client-side routing
- Built with assistance from [Claude](https://claude.ai) (Anthropic)
