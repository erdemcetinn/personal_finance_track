# FinTrack — Scope & design (final)

## 1) Summary
**Product:** FinTrack — personal finance (income & expense tracking).  
**Stack:** Static HTML5, CSS3, vanilla JavaScript, `localStorage`. No server.

**Deliverables by week (completed):**
- **Week 1–2:** Semantic HTML structure and navigation.
- **Week 3:** Introductory CSS (neutral palette) + Categories page.
- **Week 4:** CRUD for transactions & categories, filters, dashboard totals from real data.
- **Week 5:** Reports page, SVG charts, JSON backup/restore, transaction edit, UX polish.

## 2) Scope

### In scope
- Transactions: create, read, update, delete; filters; notes.
- Categories: create, delete; datalist suggestions on transactions.
- Dashboard: month-scoped KPIs, expense-by-category SVG chart, recent list, export/import.
- Reports: month-scoped breakdown table + chart.

### Out of scope
- Login / multi-user
- Cloud sync, API, database
- Bank import automation

## 3) Pages
| Page | File | Purpose |
|------|------|---------|
| Dashboard | `index.html` | Month KPIs, chart, recent tx, backup |
| Transactions | `pages/transactions.html` | Full ledger + filters + edit |
| Categories | `pages/categories.html` | Category master list |
| Reports | `pages/reports.html` | Category matrix + chart |

## 4) Data model (stored JSON)

### Transaction
- `id`: string  
- `type`: `"income"` \| `"expense"`  
- `date`: `YYYY-MM-DD`  
- `amount`: number  
- `category`: string  
- `note`: string (optional)

### Category
- `id`: string  
- `name`: string  
- `type`: `"income"` \| `"expense"`

### Export file
```json
{
  "version": 1,
  "exportedAt": "ISO-8601",
  "transactions": [ ... ],
  "categories": [ ... ]
}
```

## 5) Design
- Neutral grayscale UI, readable tables and forms.
- Accessible labels, table captions, `time` for dates, chart `role="img"`.

## 6) Risks / notes
- Data is **per browser / per origin**. Private mode may clear storage.
- Import **replace** overwrites existing `localStorage` keys for this app.
