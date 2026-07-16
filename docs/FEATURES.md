# ReliefIQ Feature Specifications

Each feature includes: description, acceptance criteria, and implementation notes.

---

## F1 — Disaster Report Submission

**Description:** Field users submit a disaster report via a mobile-friendly web form.

**Acceptance Criteria:**
- [ ] Form accepts: description (text, Bengali or English), GPS coordinates, up to 5 images
- [ ] GPS is auto-detected via browser Geolocation API with manual fallback
- [ ] Images are compressed client-side before upload (max 10MB each)
- [ ] User sees a loading state while AI processes the report
- [ ] On success, user sees their urgency score and relief recommendations
- [ ] Form works on mobile screens (min 320px width)

---

## F2 — AI Damage Assessment (Gemma 4)

**Description:** Gemma 4 analyzes each report and returns structured assessment data.

**Acceptance Criteria:**
- [ ] Returns `damage_level`: none | minor | moderate | severe | catastrophic
- [ ] Returns `urgency_score`: low | medium | high | critical
- [ ] Returns `relief_items`: list from [food, clean_water, medicine, shelter, rescue, sanitation]
- [ ] Returns `missing_resources`: list of missing essentials
- [ ] Returns `ai_summary`: English paragraph for admin view
- [ ] Returns `confidence`: float 0.0–1.0
- [ ] Handles Bengali input — translates internally before analysis
- [ ] Processes at least 1 image when provided
- [ ] Fails gracefully if AI API is unavailable (saves report, queues for retry)

---

## F3 — Admin Dashboard

**Description:** Real-time overview of all disaster reports for relief coordinators.

**Acceptance Criteria:**
- [ ] Shows summary cards: total reports, critical count, high count, pending count
- [ ] Shows top 3 relief items currently needed across all reports
- [ ] Priority queue: list of reports sorted by urgency (critical first)
- [ ] Each report card shows: location, urgency badge, damage level, time ago, status
- [ ] Clicking a report opens a detail panel (no page navigation)
- [ ] Admin can update report status from detail panel
- [ ] Admin can assign a team name to a report
- [ ] Dashboard updates in real-time via WebSocket (no page refresh needed)
- [ ] Protected by login — unauthenticated users redirected to /admin/login

---

## F4 — Interactive Heatmap

**Description:** Leaflet.js map showing affected regions as a severity heatmap.

**Acceptance Criteria:**
- [ ] Map centers on Bangladesh by default (lat: 23.685, lng: 90.356, zoom: 7)
- [ ] Each report shown as a colored circle marker (red=critical, orange=high, yellow=medium, green=low)
- [ ] Heatmap layer shows density of reports (Leaflet.HeatLayer plugin)
- [ ] Clicking a marker shows popup: urgency, damage level, relief items needed, status
- [ ] Map updates in real-time when new reports arrive (via WebSocket)
- [ ] Toggle between marker view and heatmap view
- [ ] Weather layer overlay can be toggled on/off (OpenWeatherMap tiles)

---

## F5 — Bengali Language Support

**Description:** Field officers can submit reports in Bengali.

**Acceptance Criteria:**
- [ ] Report submission form has a language toggle (EN / বাংলা)
- [ ] All form labels and placeholder text switch to Bengali
- [ ] Bengali text is accepted in description field
- [ ] AI service detects and handles Bengali input
- [ ] AI summary is always generated in English (for admin)
- [ ] Original Bengali text is stored alongside English translation

---

## F6 — PDF Report Export

**Description:** Admin can download a formatted PDF of any report.

**Acceptance Criteria:**
- [ ] PDF includes: report ID, timestamp, location, damage level, urgency score, relief items, AI summary, images (if any), reporter info (if provided)
- [ ] ReliefIQ logo/header in PDF
- [ ] PDF is generated server-side (WeasyPrint)
- [ ] Download triggered by button click in report detail panel
- [ ] Filename format: `ReliefIQ-Report-{id}-{date}.pdf`

---

## F7 — Weather Overlay

**Description:** Live weather and flood forecast data overlaid on the map.

**Acceptance Criteria:**
- [ ] OpenWeatherMap precipitation layer shown as toggle on map
- [ ] Current weather conditions shown for clicked map location
- [ ] Weather data refreshed every 15 minutes
- [ ] Gracefully hidden if API key is not configured

---

## F8 — Report Status Tracking

**Description:** Each report progresses through a lifecycle.

**Statuses:** `submitted` → `under_review` → `aid_dispatched` → `resolved`

**Acceptance Criteria:**
- [ ] Status shown as a badge on report cards
- [ ] Admin can update status via dropdown in detail panel
- [ ] Status change is broadcast via WebSocket to all connected admins
- [ ] Reporter can check their report status via the report ID (public endpoint)

---

## F9 — Escalation Alerts

**Description:** Admin is notified immediately when a Critical report is submitted.

**Acceptance Criteria:**
- [ ] Browser notification shown to connected admins when urgency_score = "critical"
- [ ] Critical reports highlighted differently in priority queue (pulsing red border)
- [ ] Audio alert (optional, respects browser mute)
