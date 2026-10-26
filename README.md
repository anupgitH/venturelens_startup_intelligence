# AI Startup Idea Validator

A full-stack final-year CSE project using React + Vite, FastAPI, SQLAlchemy, JWT authentication, and Google Gemini.

## Features
- Register/login with hashed passwords and JWT
- Submit startup ideas with industry, audience, budget and geography
- AI-generated validation report: score, summary, customer problem, market hypotheses, competitors to research, SWOT, risks, monetization and 30-day MVP roadmap
- Persistent analysis history
- Delete saved analyses
- Browser print / Save as PDF report
- Interactive API documentation at `/docs`
- Works with SQLite out of the box; can use MySQL via `DATABASE_URL`

> Scores and market statements are decision-support estimates, not guarantees. Competitor suggestions are research leads, not verified live market research.

## Requirements
- Python 3.11+
- Node.js 20+
- Google Gemini API key (optional; without one, the app returns a clearly labeled demo report)

## 1. Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
# Add GEMINI_API_KEY to .env to enable Gemini
uvicorn app.main:app --reload --port 8000
```
Open `http://localhost:8000/docs`.

## 2. Frontend
In a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL shown (usually `http://localhost:5173`).

## Environment
Backend `.env`:
- `SECRET_KEY`: replace with a long random secret before deployment
- `DATABASE_URL`: defaults to local SQLite; for MySQL use `mysql+pymysql://USER:PASSWORD@HOST:3306/DB_NAME`
- `GEMINI_API_KEY`: optional for demo mode
- `GEMINI_MODEL`: defaults to `gemini-2.5-flash`
- `FRONTEND_ORIGINS`: comma-separated origins, defaults to localhost Vite
- `ACCESS_TOKEN_MINUTES`: token lifetime

Frontend `.env`:
- `VITE_API_URL=http://localhost:8000`

## Notes
- The app creates database tables on startup.
- This is an educational starter. Before production, add email verification, password reset, rate limiting, refresh-token rotation, structured logging, migrations, and stronger abuse controls.
- Do not commit `.env` or real API keys.
