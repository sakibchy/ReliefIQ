# ReliefIQ — Local Setup Guide

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Python | 3.11+ | [python.org](https://python.org) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| Git | Any | system package manager |

## API Keys Required

1. **Google AI Studio** → [aistudio.google.com](https://aistudio.google.com) → Get API Key (free)
2. **OpenWeatherMap** → [openweathermap.org/api](https://openweathermap.org/api) → Free tier

---

## 1. Clone & Configure

```bash
git clone git@github.com:sakibchy/ReliefIQ.git
cd ReliefIQ
cp .env.example .env
```

Edit `.env` and fill in your API keys.

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run dev server
uvicorn main:app --reload --port 8000
```

- API available at: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Database created automatically at: `backend/reliefiq.db`

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- App available at: http://localhost:5173
- Admin dashboard: http://localhost:5173/admin

---

## 4. Development Login

Default admin credentials (set in `.env`):
```
Username: admin
Password: reliefiq_dev
```

Change these before deploying.

---

## Useful Commands

```bash
# Backend
uvicorn main:app --reload             # Dev server with hot reload
python -m pytest                      # Run tests (when added)
black .                               # Format Python code

# Frontend
npm run dev                           # Dev server
npm run build                         # Production build → dist/
npm run lint                          # Lint check
npm run preview                       # Preview production build locally
```
