const STORAGE_KEYS = {
  transactions: "fintrack.transactions.v1",
  categories: "fintrack.categories.v1",
};

const EXPORT_VERSION = 1;

function safeJsonParse(value, fallback) {
  if (value == null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadArray(key) {
  const raw = localStorage.getItem(key);
  const value = safeJsonParse(raw, []);
  return Array.isArray(value) ? value : [];
}

function saveArray(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getTransactions() {
  return loadArray(STORAGE_KEYS.transactions);
}

function setTransactions(items) {
  saveArray(STORAGE_KEYS.transactions, items);
}

function getCategories() {
  return loadArray(STORAGE_KEYS.categories);
}

function setCategories(items) {
  saveArray(STORAGE_KEYS.categories, items);
}

function ensureSeedData() {
  const existingTx = getTransactions();
  if (existingTx.length === 0) {
    setTransactions([
      { id: uid("tx"), date: "2026-03-01", type: "income", category: "Salary", amount: 32000, note: "" },
      { id: uid("tx"), date: "2026-03-02", type: "expense", category: "Rent", amount: 9500, note: "" },
    ]);
  }

  const existingCats = getCategories();
  if (existingCats.length === 0) {
    setCategories([
      { id: uid("cat"), name: "Salary", type: "income" },
      { id: uid("cat"), name: "Side income", type: "income" },
      { id: uid("cat"), name: "Rent", type: "expense" },
      { id: uid("cat"), name: "Groceries", type: "expense" },
      { id: uid("cat"), name: "Transport", type: "expense" },
    ]);
  }
}

function normalizeTransaction(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" && raw.id ? raw.id : uid("tx");
  const type = raw.type === "income" || raw.type === "expense" ? raw.type : null;
  const date = typeof raw.date === "string" ? raw.date : "";
  const amount = Number(raw.amount);
  const category = typeof raw.category === "string" ? raw.category.trim() : "";
  const note = typeof raw.note === "string" ? raw.note : "";
  if (!type || !date || !category || !Number.isFinite(amount)) return null;
  return { id, type, date, category, amount, note };
}

function normalizeCategory(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" && raw.id ? raw.id : uid("cat");
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const type = raw.type === "income" || raw.type === "expense" ? raw.type : null;
  if (!name || !type) return null;
  return { id, name, type };
}

function exportSnapshot() {
  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    transactions: getTransactions(),
    categories: getCategories(),
  };
}

function importSnapshot(payload, { replace } = { replace: true }) {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Invalid file" };

  const txIn = Array.isArray(payload.transactions) ? payload.transactions : [];
  const catIn = Array.isArray(payload.categories) ? payload.categories : [];

  const transactions = [];
  for (const t of txIn) {
    const n = normalizeTransaction(t);
    if (n) transactions.push(n);
  }

  const categories = [];
  const seen = new Set();
  for (const c of catIn) {
    const n = normalizeCategory(c);
    if (!n) continue;
    const key = `${n.type}|${n.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    categories.push(n);
  }

  if (replace) {
    setTransactions(transactions);
    setCategories(categories);
    return { ok: true, transactions: transactions.length, categories: categories.length };
  }

  const existingTx = getTransactions();
  const existingCat = getCategories();
  const txIds = new Set(existingTx.map((t) => t.id));
  const mergedTx = [...existingTx];
  for (const t of transactions) {
    if (txIds.has(t.id)) continue;
    txIds.add(t.id);
    mergedTx.push(t);
  }

  const catKey = (c) => `${c.type}|${c.name.toLowerCase()}`;
  const catKeys = new Set(existingCat.map(catKey));
  const mergedCat = [...existingCat];
  for (const c of categories) {
    const k = catKey(c);
    if (catKeys.has(k)) continue;
    catKeys.add(k);
    mergedCat.push(c);
  }

  setTransactions(mergedTx);
  setCategories(mergedCat);
  return { ok: true, transactions: mergedTx.length, categories: mergedCat.length };
}

window.FinTrackStorage = {
  getTransactions,
  setTransactions,
  getCategories,
  setCategories,
  ensureSeedData,
  exportSnapshot,
  importSnapshot,
  uid,
};
