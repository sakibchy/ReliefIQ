# Frontend — React + Vite Application

## Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Router setup (React Router)
    ├── index.css          # Global styles, CSS variables, design tokens
    │
    ├── pages/
    │   ├── Home.jsx       # Landing page (public)
    │   ├── Submit.jsx     # Disaster report submission form
    │   ├── Status.jsx     # Report status checker (by report ID)
    │   ├── Admin.jsx      # Admin dashboard (protected)
    │   └── Login.jsx      # Admin login
    │
    ├── components/
    │   ├── Map/
    │   │   ├── DisasterMap.jsx       # Main Leaflet map wrapper
    │   │   ├── HeatmapLayer.jsx      # Leaflet.HeatLayer integration
    │   │   ├── ReportMarker.jsx      # Individual report pin
    │   │   └── WeatherLayer.jsx      # OpenWeatherMap tile overlay
    │   │
    │   ├── Dashboard/
    │   │   ├── StatsCards.jsx        # Summary stat cards
    │   │   ├── PriorityQueue.jsx     # Sorted list of urgent reports
    │   │   ├── ReportDetail.jsx      # Detail panel (slide-in)
    │   │   └── ReliefNeeds.jsx       # Top relief items chart
    │   │
    │   ├── ReportForm/
    │   │   ├── ReportForm.jsx        # Main form component
    │   │   ├── ImageUpload.jsx       # Drag-and-drop image upload
    │   │   ├── LocationPicker.jsx    # GPS + manual location input
    │   │   └── LanguageToggle.jsx    # EN / বাংলা toggle
    │   │
    │   └── common/
    │       ├── Navbar.jsx
    │       ├── UrgencyBadge.jsx      # Colored urgency label
    │       ├── StatusBadge.jsx       # Report status label
    │       ├── LoadingSpinner.jsx
    │       └── ErrorAlert.jsx
    │
    ├── services/
    │   └── api.js         # All API calls — use these, never raw fetch
    │
    ├── hooks/
    │   ├── useWebSocket.js          # WebSocket connection hook
    │   ├── useGeolocation.js        # Browser GPS hook
    │   └── useReports.js            # Reports data fetching hook
    │
    └── utils/
        ├── constants.js             # URGENCY_COLORS, STATUS_LABELS, etc.
        └── formatters.js            # Date formatting, label formatting
```

## Key Conventions

- Functional components with hooks only (no class components)
- CSS classes only — no inline styles
- All API calls via `src/services/api.js`
- CSS variables defined in `src/index.css` under `:root`

## Running

```bash
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → dist/
```
