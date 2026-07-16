# ReliefIQ API Reference

Base URL: `https://your-domain.com/api`  
Local: `http://localhost:8000/api`

All responses follow the envelope format:
```json
{ "success": true, "data": { ... }, "error": null }
```

---

## Reports

### POST /api/reports
Submit a new disaster report.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `description` | string | ✅ | Damage description (Bengali or English) |
| `lat` | float | ✅ | GPS latitude |
| `lng` | float | ✅ | GPS longitude |
| `address` | string | ❌ | Human-readable address |
| `images` | file[] | ❌ | Up to 5 JPEG/PNG images (max 10MB each) |
| `reporter_name` | string | ❌ | Reporter's name |
| `reporter_phone` | string | ❌ | Reporter's phone number |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "submitted",
    "urgency_score": "high",
    "damage_level": "severe",
    "relief_items": ["food", "clean_water", "shelter"],
    "ai_summary": "A severe flood has damaged residential areas...",
    "confidence": 0.87
  }
}
```

---

### GET /api/reports
List all reports. Admin only.

**Query params:**
- `page` (int, default 1)
- `limit` (int, default 20)
- `status` (filter: submitted | under_review | aid_dispatched | resolved)
- `urgency` (filter: low | medium | high | critical)
- `from_date` (ISO date)
- `to_date` (ISO date)

---

### GET /api/reports/{id}
Get a single report by ID.

---

### PATCH /api/reports/{id}/status
Update report status. Admin only.

**Body:**
```json
{ "status": "aid_dispatched", "assigned_team": "Team Alpha" }
```

---

### GET /api/reports/{id}/pdf
Download PDF report. Returns binary PDF.

---

## Dashboard

### GET /api/dashboard/stats
Returns summary statistics for the admin dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reports": 142,
    "critical": 12,
    "high": 38,
    "medium": 61,
    "low": 31,
    "resolved": 55,
    "pending": 87,
    "top_relief_needed": ["food", "clean_water", "rescue"]
  }
}
```

---

### GET /api/dashboard/map
Returns GeoJSON for map rendering.

**Response:**
```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [90.4125, 23.8103] },
        "properties": {
          "id": "uuid",
          "urgency_score": "critical",
          "damage_level": "catastrophic",
          "status": "submitted",
          "created_at": "2026-07-16T10:30:00Z"
        }
      }
    ]
  }
}
```

---

## WebSocket

### WS /ws/dashboard
Real-time updates for admin dashboard.

**Messages received (server → client):**
```json
{
  "event": "new_report",
  "data": { "id": "uuid", "urgency_score": "critical", "lat": 23.8, "lng": 90.4 }
}
```
```json
{
  "event": "status_updated",
  "data": { "id": "uuid", "status": "aid_dispatched" }
}
```

---

## Auth

### POST /api/auth/login
Admin login.

**Body:** `{ "username": "admin", "password": "..." }`  
**Response:** Sets httpOnly JWT cookie, returns `{ "success": true }`

### POST /api/auth/logout
Clears session cookie.
