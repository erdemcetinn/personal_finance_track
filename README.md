# FinTrack

**Local-first personal finance & bookkeeping** in the browser — track income and expenses, organize by category, see monthly summaries and simple charts. Built as a **multi-week web course project**, evolving from semantic HTML to CSS, then vanilla JavaScript and `localStorage`.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Purpose / why this project

The goal was to build a **credible mini product** for a portfolio: not a single demo page, but a **coherent app** with:

- Clear **information architecture** (dashboard, ledger, categories, reports).
- **Progressive enhancement** across weeks: structure → presentation → behavior → polish.
- **Real persistence** without a backend, so the app is usable day-to-day and demonstrable in interviews.

FinTrack shows that you can ship **structured UI**, **data modeling**, **CRUD + filters**, **basic data viz (SVG)**, and **import/export** using only the web platform.

---

## Features

| Area | What you get |
|------|----------------|
| **Dashboard** | Month picker, income / expense / **net**, **SVG** horizontal bars for **expenses by category**, recent activity with notes, **JSON backup** (export / import with replace or merge). |
| **Transactions** | Add, **edit**, **delete** (with confirm); filters by date range, type, and category text; optional notes; category suggestions from your category list. |
| **Categories** | Maintain income vs expense categories; duplicate protection; delete with confirm. |
| **Reports** | Same month scope: totals table, **per-category** income / expense / net matrix, expense chart. |

---

## Tech stack

- **HTML5** — Semantic layout, forms, tables, `figure` / SVG, accessibility-minded markup.
- **CSS3** — Neutral grayscale UI, layout, responsive nav, button variants.
- **JavaScript (ES6+)** — No frameworks; modular scripts loaded as classic scripts; **`localStorage`** for persistence.
- **SVG** — Small chart helper (`assets/js/charts.js`) for category breakdown.

---

## Project structure

```
personal-finance/
├── index.html                 # Dashboard + backup
├── pages/
│   ├── transactions.html
│   ├── categories.html
│   └── reports.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── storage.js         # localStorage + import/export
│       ├── charts.js
│       ├── dashboard.js
│       ├── transactions.js
│       ├── categories.js
│       └── reports.js
└── docs/
    ├── stage-1-scope-design.md
    └── progress-log.md
```

---

## Getting started

**Option A — open the file**

Open `index.html` in a modern browser (Chrome, Firefox, Safari, Edge).

**Option B — local server** (recommended if you hit any file-URL quirks)

```bash
cd personal-finance
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## Data & privacy

- All data stays **in your browser** (`localStorage` on this origin).
- Use **Export JSON** on the Dashboard before clearing site data or switching browsers.
- Import supports **replace** (overwrite) or **merge** (append new records).

---

## Course / timeline (high level)

Documented in [`docs/progress-log.md`](docs/progress-log.md) and [`docs/stage-1-scope-design.md`](docs/stage-1-scope-design.md):

1. Static HTML prototype  
2. Semantic HTML refinements  
3. CSS + categories page  
4. JavaScript + `localStorage` + CRUD/filters  
5. Reports, charts, edit flow, backup/restore, UI polish  

---

## Türkçe — kısa özet

**FinTrack**, tarayıcıda çalışan **yerel (local-first) kişisel muhasebe** uygulamasıdır: gelir/gider kaydı, kategoriler, aylık özet, basit **SVG grafikler** ve **JSON yedekleme**. Amaç; portföyde **uçtan uca düşünülmüş** bir ürün göstermek: sadece HTML/CSS/JS ile backend olmadan kalıcı veri, filtreleme ve raporlama.

---

## License

This project is provided for **portfolio and educational** use. Add a license file if you need explicit terms (e.g. MIT).
