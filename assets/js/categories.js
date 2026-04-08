function $(id) {
  return document.getElementById(id);
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function render() {
  const tbody = $("categoriesTbody");
  const categories = window.FinTrackStorage.getCategories()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  tbody.innerHTML = "";

  if (categories.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 3;
    td.className = "empty-cell";
    td.textContent = "No categories yet. Add one above.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const cat of categories) {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = cat.name;

    const tdType = document.createElement("td");
    tdType.textContent = cat.type === "income" ? "Income" : "Expense";

    const tdActions = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-danger btn-small";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      if (!confirm(`Delete category "${cat.name}" (${cat.type})?`)) return;
      const next = window.FinTrackStorage.getCategories().filter((c) => c.id !== cat.id);
      window.FinTrackStorage.setCategories(next);
      render();
    });
    tdActions.appendChild(delBtn);

    tr.appendChild(tdName);
    tr.appendChild(tdType);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }
}

function addCategory({ name, type }) {
  const trimmed = normalizeName(name);
  if (!trimmed) return false;

  const existing = window.FinTrackStorage.getCategories();
  const dup = existing.some(
    (c) => c.type === type && c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (dup) {
    alert("A category with this name and type already exists.");
    return false;
  }

  const next = [
    ...existing,
    { id: `cat_${Date.now()}_${Math.random().toString(16).slice(2)}`, name: trimmed, type },
  ];
  window.FinTrackStorage.setCategories(next);
  return true;
}

function main() {
  window.FinTrackStorage.ensureSeedData();

  const form = $("categoryForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("catName").value;
    const type = $("catType").value;
    if (!type) return;
    const added = addCategory({ name, type });
    if (added) form.reset();
    render();
  });

  render();
}

main();

