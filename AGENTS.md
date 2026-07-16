# AGENTS.md — AI Agent Instructions for ReliefIQ

> This file is the **primary guide for AI coding agents** (Antigravity, Copilot, Cursor, etc.)
> working on the ReliefIQ codebase. Read this file before making any changes.

---

## 📌 Project Summary

**ReliefIQ** is a disaster response platform for Bangladesh.
- Field users submit disaster reports (photo + GPS + description)
- Gemma 4 (via Google AI Studio) analyzes each report and returns: damage level, urgency score, relief recommendations, and a summary
- An admin dashboard shows a real-time heatmap and priority queue

---

## 🏗️ Codebase Map

```
ReliefIQ/
├── backend/         ← FastAPI (Python 3.11+)
├── frontend/        ← React 18 + Vite
├── docs/            ← Feature specs, API reference, setup guides
├── nginx/           ← Nginx config (Raspberry Pi deployment)
├── systemd/         ← systemd service files
└── scripts/         ← Setup and deploy scripts
```

---

## 🔑 Key Files to Understand First

| File | What it does |
|---|---|
| `backend/main.py` | FastAPI app factory — registers all routers, CORS, WebSocket |
| `backend/config.py` | All settings loaded from `.env` — use `settings.GEMMA_API_KEY` |
| `backend/models/database.py` | SQLModel table definitions — all DB schema lives here |
| `backend/services/gemma_service.py` | **All Gemma 4 API calls live here** — do not call the AI API anywhere else |
| `backend/services/report_service.py` | Business logic for creating/updating reports |
| `backend/routers/reports.py` | `/api/reports` route handlers |
| `backend/routers/admin.py` | `/api/dashboard/*` route handlers |
| `frontend/src/services/api.js` | All frontend → backend API calls — use these functions, don't use fetch directly |
| `frontend/src/pages/Submit.jsx` | User-facing report submission page |
| `frontend/src/pages/Admin.jsx` | Admin dashboard page |
| `frontend/src/components/Map/` | Leaflet map components |

---

## 🤖 AI Service Contract (Critical)

All AI inference goes through `backend/services/gemma_service.py`.

### Input to `analyze_report()`
```python
{
  "description": str,           # User's text description (may be in Bengali)
  "images": list[str],          # Base64-encoded images (up to 5)
  "location": {
    "lat": float,
    "lng": float,
    "address": str              # Optional reverse-geocoded address
  }
}
```

### Output from `analyze_report()`
```python
{
  "damage_level": "none" | "minor" | "moderate" | "severe" | "catastrophic",
  "urgency_score": "low" | "medium" | "high" | "critical",
  "relief_items": list[str],    # e.g. ["food", "clean_water", "medicine", "shelter", "rescue"]
  "missing_resources": list[str],
  "ai_summary": str,            # English summary for admin
  "confidence": float           # 0.0 to 1.0
}
```

**Never call the Gemma API directly from routers or other services.**

---

## 🗄️ Database Schema

Tables defined in `backend/models/database.py`:

### `Report`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `created_at` | datetime | Auto-set |
| `updated_at` | datetime | Auto-updated |
| `status` | enum | `submitted`, `under_review`, `aid_dispatched`, `resolved` |
| `description` | str | User's original text |
| `description_en` | str | AI-translated to English (if Bengali) |
| `lat` | float | GPS latitude |
| `lng` | float | GPS longitude |
| `address` | str | Optional address string |
| `image_paths` | JSON | List of stored image file paths |
| `damage_level` | enum | AI output |
| `urgency_score` | enum | AI output |
| `relief_items` | JSON | AI output list |
| `missing_resources` | JSON | AI output list |
| `ai_summary` | str | AI-generated summary |
| `confidence` | float | AI confidence score |
| `assigned_team` | str | Optional volunteer team name |

---

## 🌐 API Conventions

- All routes are prefixed `/api/`
- Responses always follow this envelope:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```
- Errors:
  ```json
  {
    "success": false,
    "data": null,
    "error": "Human-readable error message"
  }
  ```
- Pagination uses `?page=1&limit=20` query params
- Timestamps are ISO 8601 UTC strings

---

## ⚛️ Frontend Conventions

- **State management:** React `useState` + `useContext` — no Redux/Zustand for now
- **Styling:** Vanilla CSS with CSS variables defined in `src/index.css`
- **No inline styles** — use CSS classes only
- **API calls:** Always use functions from `src/services/api.js` — never raw `fetch`
- **Component naming:** PascalCase files and components
- **Map:** All Leaflet code lives in `src/components/Map/`
- **i18n:** Bengali/English toggle stored in `LocaleContext`

---

## 🐍 Backend Conventions

- **Python version:** 3.11+
- **Type hints:** Required on all function signatures
- **ORM:** SQLModel (combines SQLAlchemy + Pydantic)
- **Async:** All route handlers and service functions must be `async def`
- **Error handling:** Use `HTTPException` from FastAPI — never return raw 500s
- **Validation:** Use Pydantic models for all request/response bodies
- **No business logic in routers** — routers call services, services do the work

---

## 🔧 Environment Variables

Defined in `.env` (copy from `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `GEMMA_API_KEY` | ✅ | Google AI Studio API key |
| `OPENWEATHER_API_KEY` | ✅ | OpenWeatherMap API key |
| `DATABASE_URL` | ✅ | `sqlite:///./reliefiq.db` for local |
| `CORS_ORIGINS` | ✅ | Comma-separated allowed origins |
| `UPLOAD_DIR` | ✅ | Directory for uploaded images |
| `MAX_IMAGE_SIZE_MB` | ❌ | Default: 10 |
| `MAX_IMAGES_PER_REPORT` | ❌ | Default: 5 |
| `SECRET_KEY` | ✅ | JWT signing key (admin auth) |

---

## 🚫 Do Not

- Do NOT call the Gemma API outside of `gemma_service.py`
- Do NOT add business logic in router files
- Do NOT use `fetch` directly in frontend — use `src/services/api.js`
- Do NOT commit `.env` files
- Do NOT add new npm packages without updating `package.json`
- Do NOT use `any` type in TypeScript (if TS is added later)
- Do NOT store images in the database — store paths only

---

## ✅ Adding a New Feature Checklist

1. Add/update DB model in `backend/models/database.py`
2. Add service function in `backend/services/`
3. Add route in appropriate `backend/routers/` file
4. Register router in `backend/main.py` if new file
5. Add API function in `frontend/src/services/api.js`
6. Build UI component in `frontend/src/components/`
7. Update `docs/API.md` with new endpoints
8. Update `docs/FEATURES.md` with acceptance criteria

---

## 📚 Further Reading

- [docs/API.md](docs/API.md) — Full API reference
- [docs/SETUP.md](docs/SETUP.md) — Local development setup
- [docs/FEATURES.md](docs/FEATURES.md) — Feature specs with acceptance criteria
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Raspberry Pi + Cloudflare Tunnel deployment
- [ARCHITECTURE.md](ARCHITECTURE.md) — System design decisions
