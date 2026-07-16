# ReliefIQ — System Architecture

## Design Principles

1. **Lightweight first** — runs on Raspberry Pi (4GB RAM target)
2. **Offline resilient** — reports cached locally if API is unavailable
3. **AI-centered** — Gemma 4 is the decision engine, not a chatbot
4. **Real-time** — admin dashboard updates live via WebSocket

---

## Component Breakdown

### 1. Nginx (Port 80/443)
- Serves the built React app as static files from `/var/www/reliefiq/`
- **PWA Ready**: The frontend acts as a Progressive Web App (PWA) with a manifest and service worker, allowing native-like mobile install.
- Reverse proxies `/api/*` and `/ws/*` to FastAPI on port 8000
- Handles SSL termination (Cloudflare manages the certificate)

### 2. FastAPI Backend (Port 8000)
- **Routers:** Thin HTTP handlers — validate input, call services, return responses
- **Services:** All business logic — AI calls, DB writes, PDF generation
- **Models:** SQLModel definitions — single source of truth for DB schema

### 3. SQLite Database
- Stored at `/var/lib/reliefiq/reliefiq.db`
- Backed up daily via cron to `/var/lib/reliefiq/backups/`

### 4. Gemma 4 (Google AI Studio)
- Called exclusively from `backend/services/gemma_service.py`
- Uses multimodal endpoint (text + vision)
- Prompt template stored in `backend/services/prompts/analyze_report.txt`

### 5. Cloudflare Tunnel
- `cloudflared` daemon runs as a systemd service
- Routes `https://reliefiq.yourdomain.com` → `localhost:80`
- Zero-trust — no ports exposed to internet

---

## Data Flow

### Report Submission
```
User submits form
  → Frontend validates (size, required fields)
  → POST /api/reports (multipart/form-data)
  → Backend saves images to disk
  → Calls gemma_service.analyze_report()
  → Saves report + AI results to SQLite
  → Broadcasts update via WebSocket
  → Returns report ID to user
```

### Admin Dashboard Load
```
Admin opens /admin
  → GET /api/dashboard/stats  (summary cards)
  → GET /api/dashboard/map    (GeoJSON for heatmap)
  → WS  /ws/dashboard         (subscribe to live updates)
  → New report arrives → WebSocket pushes update → map re-renders
```

---

## Scalability Notes

For the hackathon, SQLite + single Uvicorn worker is sufficient.
If scaling beyond Pi:
- Replace SQLite with PostgreSQL
- Add Redis for WebSocket pub/sub
- Move image storage to S3/R2
- Deploy FastAPI behind Gunicorn with multiple workers

---

## Security Notes

- Admin dashboard protected by JWT (stored in httpOnly cookie)
- File uploads validated: JPEG/PNG only, max 10MB per image
- Rate limiting on `/api/reports` (10 submissions/hour per IP)
- All env secrets loaded from `.env` — never hardcoded
