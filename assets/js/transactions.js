function $(id) {
  return document.getElementById(id);
}

function formatType(type) {
  return type === "income" ? "Income" : "Expense";
}

function normalizeText(v) {
  return String(v || "").trim().replace(/\s+/g, " ");
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function renderCategoryDatalist() {
  const dl = $("categoryList");
  const categories = window.FinTrackStorage.getCategories()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
  dl.innerHTML = "";
  for (const c of categories) {
    const opt = document.createElement("option");
    opt.value = c.name;
    dl.appendChild(opt);
  }
}

function applyFilters(items) {
  const from = $("fromDate").value;
  const to = $("toDate").value;
  const type = $("filterType").value;
  const category = normalizeText($("filterCategory").value).toLowerCase();

  return items.filter((tx) => {
    if (from && tx.date < from) return false;
    if (to && tx.date > to) return false;
    if (type !== "all" && tx.type !== type) return false;
    if (category && !String(tx.category).toLowerCase().includes(category)) return false;
    return true;
  });
}

function clearEditMode() {
  $("editTxId").value = "";
  $("txLegend").textContent = "New transaction";
  $("txSubmitBtn").textContent = "Save";
  $("cancelEditBtn").hidden = true;
  $("formHint").textContent =
    "Fill the form and save. Use categories from the Categories page or type a new name.";
}

function startEdit(tx) {
  $("editTxId").value = tx.id;
  $("type").value = tx.type;
  $("date").value = tx.date;
  $("amount").value = String(tx.amount);
  $("category").value = tx.category;
  $("note").value = tx.note || "";
  $("txLegend").textContent = "Edit transaction";
  $("txSubmitBtn").textContent = "Update";
  $("cancelEditBtn").hidden = false;
  $("formHint").textContent = "You are editing an existing entry. Save to apply changes.";
  $("txForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function render() {
  const tbody = $("txTbody");
  const all = window.FinTrackStorage.getTransactions()
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  const items = applyFilters(all);

  tbody.innerHTML = "";

  if (items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "empty-cell";
    td.textContent = "No transactions match the current filters.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const tx of items) {
    const tr = document.createElement("tr");

    const tdDate = document.createElement("td");
    const time = document.createElement("time");
    time.dateTime = tx.date;
    time.textContent = tx.date;
    tdDate.appendChild(time);

    const tdType = document.createElement("td");
    tdType.textContent = formatType(tx.type);

    const tdCategory = document.createElement("td");
    tdCategory.textContent = tx.category;

    const tdAmount = document.createElement("td");
    tdAmount.textContent = Number(tx.amount).toLocaleString("tr-TR", { maximumFractionDigits: 2 });

    const tdNote = document.createElement("td");
    const note = tx.note ? String(tx.note) : "";
    tdNote.textContent = note ? (note.length > 36 ? `${note.slice(0, 36)}…` : note) : "—";

    const tdActions = document.createElement("td");
    tdActions.className = "actions-cell";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-secondary btn-small";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(tx));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-danger btn-small";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      if (!confirm(`Delete this ${tx.type} transaction (${tx.category}, ${tx.date})?`)) return;
      const next = window.FinTrackStorage.getTransactions().filter((t) => t.id !== tx.id);
      window.FinTrackStorage.setTransactions(next);
      if ($("editTxId").value === tx.id) {
        $("txForm").reset();
        clearEditMode();
      }
      render();
    });

    tdActions.appendChild(editBtn);
    tdActions.appendChild(document.createTextNode(" "));
    tdActions.appendChild(delBtn);

    tr.appendChild(tdDate);
    tr.appendChild(tdType);
    tr.appendChild(tdCategory);
    tr.appendChild(tdAmount);
    tr.appendChild(tdNote);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }
}

function upsertTransaction({ id, date, type, category, amount, note }) {
  const list = window.FinTrackStorage.getTransactions();
  if (id) {
    const next = list.map((t) =>
      t.id === id ? { ...t, date, type, category, amount, note } : t,
    );
    window.FinTrackStorage.setTransactions(next);
    return;
  }
  window.FinTrackStorage.setTransactions([
    ...list,
    {
      id: `tx_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      date,
      type,
      category,
      amount,
      note,
    },
  ]);
}

function main() {
  window.FinTrackStorage.ensureSeedData();
  renderCategoryDatalist();

  const txForm = $("txForm");
  txForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const editId = normalizeText($("editTxId").value);
    const type = $("type").value;
    const date = $("date").value;
    const amount = toNumber($("amount").value);
    const category = normalizeText($("category").value);
    const note = normalizeText($("note").value);

    if (!type || !date || !category || !Number.isFinite(amount)) return;

    upsertTransaction({ id: editId || null, date, type, category, amount, note });
    txForm.reset();
    clearEditMode();
    render();
  });

  $("cancelEditBtn").addEventListener("click", () => {
    txForm.reset();
    clearEditMode();
  });

  const filtersForm = $("filtersForm");
  filtersForm.addEventListener("submit", (e) => {
    e.preventDefault();
    render();
  });

  $("resetFilters").addEventListener("click", () => {
    filtersForm.reset();
    render();
  });

  render();
}

main();
