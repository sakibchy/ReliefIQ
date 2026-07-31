# 🚨 ReliefIQ — AI-Powered Disaster Response Platform

> **Hackathon:** Build with Gemma 4 — ML, AI, Deep Learning & NLP Community  
> **Team:** sakibchy + Ambia Ferdous Mimim  
> **Model:** Gemma 4 via Google AI Studio  
> **Status:** 🚧 In Development

---

## 📌 Problem Statement

During floods, cyclones, earthquakes, and other natural disasters, relief organizations in Bangladesh struggle to:
- Identify the **most affected areas** quickly
- **Prioritize aid** based on severity
- Process scattered, manually verified reports that delay emergency response

## 💡 Solution

**ReliefIQ** is an AI-powered disaster response platform that helps relief organizations assess damage, prioritize victims, and allocate resources efficiently — powered by **Gemma 4**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📷 **Damage Assessment** | AI analyzes uploaded photos + descriptions to estimate severity |
| 🔢 **Urgency Scoring** | Assigns Low / Medium / High / Critical priority to each report |
| 🎒 **Relief Recommendations** | Suggests food, water, medicine, shelter, or rescue based on context |
| 🌐 **Bengali Language Support** | Field officers can submit reports in Bengali |
| 🗺️ **Interactive Heatmap** | Real-time map showing affected zones and severity |
| 📊 **Admin Dashboard** | Live analytics, priority queue, and resource gap overview |
| 📄 **PDF Report Export** | Auto-generate printable reports for coordinators |
| 🌦️ **Weather Integration** | Live weather + flood forecast overlay via OpenWeatherMap |
| 📋 **Report Status Tracking** | Submitted → Under Review → Aid Dispatched → Resolved |
| 🔔 **Escalation Alerts** | Auto-notify admin when Critical reports arrive |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Field User / Volunteer              │
│         (Phone or Browser — photo + GPS + text)     │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────┐
│              Cloudflare Tunnel (Public HTTPS)        │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│                 Raspberry Pi Server                   │
│                                                       │
│  ┌─────────────┐    ┌──────────────────────────┐    │
│  │    Nginx     │───▶│  FastAPI + Uvicorn        │    │
│  │ (port 80/443)│    │  (port 8000)              │    │
│  │ Serves React │    │  REST API + WebSockets    │    │
│  └─────────────┘    └───────────┬──────────────┘    │
│                                  │                    │
│                      ┌───────────▼──────────┐        │
│                      │  SQLite Database      │        │
│                      │  (SQLModel ORM)       │        │
│                      └──────────────────────┘        │
└─────────────────────────────────────────────────────┘
                      │
                      │ API calls
                      ▼
┌─────────────────────────────────────────────────────┐
│           Google AI Studio — Gemma 4                 │
│   (Damage assessment, urgency scoring,               │
│    relief recommendations, report generation)        │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **AI Model** | Gemma 4 (Google AI Studio) | Core intelligence |
| **Backend** | FastAPI + Uvicorn | REST API + WebSocket server |
| **Frontend** | React + Vite | User & admin interface |
| **Database** | SQLite + SQLModel | Persistent storage |
| **Web Server** | Nginx | Static files + reverse proxy |
| **Process Manager** | systemd | Service management on Pi |
| **Public Access** | Cloudflare Tunnel | HTTPS tunnel from Pi |
| **Maps** | Leaflet.js + OpenStreetMap | Interactive disaster map |
| **PDF** | WeasyPrint | Report export |
| **Weather** | OpenWeatherMap API | Weather overlay |

---

## 📁 Project Structure

```
ReliefIQ/
├── README.md                   # ← You are here
├── ARCHITECTURE.md             # Detailed system design
├── AGENTS.md                   # AI agent instructions & conventions
├── CONTRIBUTING.md             # Contribution guidelines
├── .env.example                # Required environment variables
├── .gitignore
│
├── docs/
│   ├── API.md                  # Full API reference
│   ├── SETUP.md                # Local & Pi setup guide
│   ├── FEATURES.md             # Feature specs & acceptance criteria
│   └── DEPLOYMENT.md           # Pi + Cloudflare deployment guide
│
├── backend/                    # FastAPI application
│   ├── main.py                 # App entry point
│   ├── config.py               # Settings & environment config
│   ├── requirements.txt        # Python dependencies
│   ├── models/                 # SQLModel database models
│   ├── routers/                # API route handlers
│   ├── services/               # Business logic layer
│   └── utils/                  # Helper utilities
│
├── frontend/                   # React + Vite application
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── components/         # Reusable UI components
│       ├── pages/              # Route-level page components
│       ├── services/           # API client functions
│       ├── hooks/              # Custom React hooks
│       └── utils/              # Frontend utilities
│
├── nginx/
│   └── reliefiq.conf           # Nginx config for Pi
├── systemd/
│   └── reliefiq.service        # systemd service definition
└── scripts/
    ├── setup.sh                # One-command Pi setup
    └── deploy.sh               # Deploy latest changes
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- Google AI Studio API key → [aistudio.google.com](https://aistudio.google.com)
- OpenWeatherMap API key → [openweathermap.org](https://openweathermap.org/api) (free)

### 1. Clone & Configure
```bash
git clone git@github.com:sakibchy/ReliefIQ.git
cd ReliefIQ
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open
- **User App:** http://localhost:5173
- **Admin Dashboard:** http://localhost:5173/admin
- **API Docs:** http://localhost:8000/docs

---

## 🌐 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/reports` | Submit a disaster report |
| `GET` | `/api/reports` | List all reports (admin) |
| `GET` | `/api/reports/{id}` | Get single report |
| `PATCH` | `/api/reports/{id}/status` | Update report status |
| `GET` | `/api/dashboard/stats` | Dashboard statistics |
| `GET` | `/api/dashboard/map` | Map data (GeoJSON) |
| `GET` | `/api/reports/{id}/pdf` | Export report as PDF |
| `WS` | `/ws/dashboard` | WebSocket for live updates |

See [docs/API.md](docs/API.md) for full reference.

---

## 🔐 Environment Variables

See [.env.example](.env.example) for all required variables.

```env
GEMMA_API_KEY=your_google_ai_studio_key
OPENWEATHER_API_KEY=your_openweathermap_key
DATABASE_URL=sqlite:///./reliefiq.db
CORS_ORIGINS=http://localhost:5173
```

---

## 📜 License

MIT — see [LICENSE](LICENSE)

---

## 🤝 Team

- **sakibchy** — Lead Developer
- **Ambia Ferdous Mimim** — Collaborator
