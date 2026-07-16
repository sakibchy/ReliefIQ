# Backend — FastAPI Application

## Structure

```
backend/
├── main.py              # App entry point — registers routers, CORS, WebSocket, startup events
├── config.py            # Pydantic Settings — loads all env vars, single source of truth
├── requirements.txt     # Python dependencies
│
├── models/
│   ├── __init__.py
│   └── database.py      # SQLModel table definitions (Report, etc.)
│
├── routers/
│   ├── __init__.py
│   ├── reports.py       # POST /api/reports, GET /api/reports, PATCH /api/reports/{id}/status
│   ├── admin.py         # GET /api/dashboard/stats, GET /api/dashboard/map
│   └── auth.py          # POST /api/auth/login, POST /api/auth/logout
│
├── services/
│   ├── __init__.py
│   ├── gemma_service.py     # ALL Gemma 4 API calls — analyze_report()
│   ├── report_service.py    # Business logic for creating/updating/querying reports
│   ├── pdf_service.py       # PDF generation with WeasyPrint
│   └── weather_service.py   # OpenWeatherMap API wrapper
│
└── utils/
    ├── __init__.py
    ├── auth.py          # JWT creation/verification
    ├── image.py         # Image validation and processing helpers
    └── websocket.py     # WebSocket connection manager
```

## Key Conventions

- All route handlers are `async def`
- No business logic in router files — call service functions
- All settings accessed via `from config import settings`
- DB session injected via FastAPI Depends

## Running

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
