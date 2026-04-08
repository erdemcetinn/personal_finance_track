function $(id) {
  return document.getElementById(id);
}

function formatAmount(n) {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
}

function monthFromDate(isoDate) {
  return isoDate.slice(0, 7);
}

function transactionsForMonth(transactions, month) {
  return transactions.filter((t) => monthFromDate(t.date) === month);
}

function setDefaultMonthInput() {
  const el = $("dashMonth");
  if (!el.value) {
    const now = new Date();
    el.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}

function aggregateExpenseByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = t.category || "Other";
    map.set(key, (map.get(key) || 0) + Number(t.amount || 0));
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function render() {
  window.FinTrackStorage.ensureSeedData();
  setDefaultMonthInput();

  const month = $("dashMonth").value;
  const all = window.FinTrackStorage.getTransactions();
  const tx = transactionsForMonth(all, month);

  const income = tx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const expense = tx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
  const net = income - expense;

  $("totalIncome").textContent = formatAmount(income);
  $("totalExpense").textContent = formatAmount(expense);
  $("totalNet").textContent = formatAmount(net);

  const emptySummary = $("emptySummary");
  if (emptySummary) emptySummary.hidden = tx.length > 0;

  const chartRows = aggregateExpenseByCategory(tx);
  window.FinTrackCharts.renderHorizontalBarChart($("expenseChart"), chartRows);

  const recent = tx.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const tbody = $("recentTbody");
  tbody.innerHTML = "";

  if (recent.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "empty-cell";
    td.textContent = "No transactions in this month yet.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const t of recent) {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    const time = document.createElement("time");
    time.dateTime = t.date;
    time.textContent = t.date;
    tdDate.appendChild(time);

    const tdType = document.createElement("td");
    tdType.textContent = t.type === "income" ? "Income" : "Expense";

    const tdCat = document.createElement("td");
    tdCat.textContent = t.category;

    const tdAmt = document.createElement("td");
    tdAmt.textContent = formatAmount(Number(t.amount || 0));

    const tdNote = document.createElement("td");
    tdNote.textContent = t.note ? String(t.note).slice(0, 40) + (t.note.length > 40 ? "…" : "") : "—";

    tr.appendChild(tdDate);
    tr.appendChild(tdType);
    tr.appendChild(tdCat);
    tr.appendChild(tdAmt);
    tr.appendChild(tdNote);
    tbody.appendChild(tr);
  }
}

function main() {
  $("dashMonth").addEventListener("change", render);

  $("exportBtn").addEventListener("click", () => {
    const data = window.FinTrackStorage.exportSnapshot();
    downloadJson(`fintrack-backup-${new Date().toISOString().slice(0, 10)}.json`, data);
  });

  $("importInput").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      alert("Invalid JSON file.");
      return;
    }
    const replace = confirm(
      "Replace all current data with this file?\n\nOK = replace\nCancel = merge (append new items)",
    );
    const res = window.FinTrackStorage.importSnapshot(parsed, { replace });
    if (!res.ok) {
      alert(res.error || "Import failed.");
      return;
    }
    alert(`Import OK. Transactions: ${res.transactions}, Categories: ${res.categories}`);
    render();
  });

  render();
}

main();
