# ReliefIQ — Hackathon Strategy & Submission Checklist

## Competition Details
- **Name:** Build with Gemma: ML, AI, Deep Learning & NLP Community Hackathon
- **Platform:** Kaggle Community Hackathon
- **Sponsor:** Google for Developers
- **Prize Pool:** $2,000 ($1,000 / $600 / $400)
- **Team Size:** Max 3
- **Submission:** One per team (editable until deadline)

---

## Judging Criteria

| Criteria | Weight | Description |
|---|---|---|
| Gemma Integration | 30% | Is Gemma 4 core to the solution? Deeply integrated? |
| Innovation & Impact | 30% | Meaningful problem? Creative approach? |
| Functionality | 20% | Does the prototype work? Convincing demo? |
| Presentation & Writeup | 20% | Clear Kaggle Writeup explaining problem + solution? |

---

## Hard Rules
- **Gemma 4 must be the ONLY LLM.** No other LLMs or generative foundation models allowed.
- Traditional ML, CV, OCR, speech, databases, APIs are fine as support tools.
- GitHub repo must be **public** during judging.
- Demo must be **publicly accessible** (no auth required to view).

---

## Submission Requirements
1. **Kaggle Writeup** (≤1,500 words) — problem, solution, Gemma integration, architecture, challenges, future work
2. **Public GitHub Repo** — complete source, README with install instructions, dependency list, config files
3. **Working Demo** — hosted app, video demo, or runnable Kaggle Notebook

## Winner Obligations (if we win)
- GitHub Repository
- Kaggle Notebook
- Kaggle Writeup
- README
- Demo Video (max 3 minutes)
- Working Prototype or Live Demo

---

## Planned Gemma 4 Feature Additions (TODO)

These features are designed to maximize the Gemma Integration score (30%).
Currently Gemma 4 is only used in `backend/services/gemma_service.py` for report analysis.
Adding more Gemma-powered features makes it the true brain of the platform.

### 1. Gemma Auto-Translation (Bengali ↔ English)
- **What:** Translate report descriptions between Bengali and English using Gemma 4.
- **Where:** New endpoint `POST /api/translate` or integrated into report submission flow.
- **Why:** Shows multilingual capability. Very relevant for Bangladesh context.
- **Effort:** ~30 min

### 2. Gemma Situation Report Generator
- **What:** Admin clicks "Generate Sitrep" → Gemma reads all active reports and produces a single executive briefing summarizing the overall disaster situation.
- **Where:** New endpoint `POST /api/admin/sitrep` + button on Admin dashboard.
- **Why:** Shows reasoning and aggregation capability. High-impact demo feature.
- **Effort:** ~30 min

### 3. Gemma Resource Allocation AI
- **What:** Given all current reports (locations, urgencies, relief needs), Gemma recommends optimal team deployment and supply distribution strategy.
- **Where:** New endpoint `POST /api/admin/allocate` + panel on Admin dashboard.
- **Why:** Shows agentic decision-making. Very impressive for judges.
- **Effort:** ~30 min

### 4. Gemma Chatbot (Lower Priority)
- **What:** Victims can ask questions like "where is the nearest shelter?" in Bengali.
- **Where:** Chat widget on the frontend.
- **Why:** Nice-to-have. Shows conversational capability.
- **Effort:** ~1 hr

---

## Pre-Submission Checklist
- [ ] Add 2-3 more Gemma-powered features (see above)
- [ ] End-to-end test: submit report → AI analysis → dashboard update → PDF download
- [ ] Make GitHub repo PUBLIC
- [ ] Record demo video (≤3 min)
- [ ] Write Kaggle Writeup (≤1,500 words)
- [ ] Create Kaggle Notebook demonstrating Gemma 4 integration
- [ ] Deploy working demo (Raspberry Pi + Cloudflare Tunnel, or alternative)
- [ ] Fill out Google Form after Kaggle submission
