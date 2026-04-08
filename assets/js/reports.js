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

function setDefaultMonth() {
  const el = $("repMonth");
  if (!el.value) {
    const now = new Date();
    el.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
}

function aggregateByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    const name = t.category || "Other";
    if (!map.has(name)) map.set(name, { income: 0, expense: 0 });
    const row = map.get(name);
    if (t.type === "income") row.income += Number(t.amount || 0);
    if (t.type === "expense") row.expense += Number(t.amount || 0);
  }
  return Array.from(map.entries())
    .map(([category, v]) => ({
      category,
      income: v.income,
      expense: v.expense,
      net: v.income - v.expense,
    }))
    .sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
}

function render() {
  window.FinTrackStorage.ensureSeedData();
  setDefaultMonth();

  const month = $("repMonth").value;
  const tx = transactionsForMonth(window.FinTrackStorage.getTransactions(), month);

  const income = tx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
  const expense = tx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);

  $("repIncome").textContent = formatAmount(income);
  $("repExpense").textContent = formatAmount(expense);
  $("repNet").textContent = formatAmount(income - expense);

  const rows = aggregateByCategory(tx);
  const tbody = $("repCatTbody");
  tbody.innerHTML = "";

  if (rows.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.className = "empty-cell";
    td.textContent = "No data for this month.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    for (const r of rows) {
      const tr = document.createElement("tr");
      const tdC = document.createElement("td");
      tdC.textContent = r.category;
      const tdI = document.createElement("td");
      tdI.textContent = r.income ? formatAmount(r.income) : "—";
      const tdE = document.createElement("td");
      tdE.textContent = r.expense ? formatAmount(r.expense) : "—";
      const tdN = document.createElement("td");
      tdN.textContent = formatAmount(r.net);
      tr.appendChild(tdC);
      tr.appendChild(tdI);
      tr.appendChild(tdE);
      tr.appendChild(tdN);
      tbody.appendChild(tr);
    }
  }

  const chartData = rows
    .filter((r) => r.expense > 0)
    .map((r) => ({ label: r.category, value: r.expense }))
    .sort((a, b) => b.value - a.value);

  window.FinTrackCharts.renderHorizontalBarChart($("repExpenseChart"), chartData);
}

function main() {
  $("repMonth").addEventListener("change", render);
  render();
}

main();
