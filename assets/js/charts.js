/**
 * Simple SVG horizontal bar chart (no dependencies).
 * @param {SVGElement} svg
 * @param {{ label: string, value: number }[]} rows
 */
function renderHorizontalBarChart(svg, rows) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const w = 520;
  const h = 220;
  const padL = 120;
  const padT = 16;
  const barH = 22;
  const gap = 10;

  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Expense totals by category");

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", "0");
  bg.setAttribute("y", "0");
  bg.setAttribute("width", String(w));
  bg.setAttribute("height", String(h));
  bg.setAttribute("fill", "#fafafa");
  svg.appendChild(bg);

  const values = rows.map((r) => r.value);
  const max = Math.max(1, ...values);

  rows.slice(0, 8).forEach((row, i) => {
    const y = padT + i * (barH + gap);
    const bw = ((w - padL - 24) * row.value) / max;

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", "8");
    label.setAttribute("y", String(y + barH * 0.72));
    label.setAttribute("fill", "#333");
    label.setAttribute("font-size", "12");
    label.textContent = row.label.length > 14 ? `${row.label.slice(0, 14)}…` : row.label;
    svg.appendChild(label);

    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar.setAttribute("x", String(padL));
    bar.setAttribute("y", String(y));
    bar.setAttribute("width", String(bw));
    bar.setAttribute("height", String(barH));
    bar.setAttribute("rx", "4");
    bar.setAttribute("fill", "#444");
    svg.appendChild(bar);

    const val = document.createElementNS("http://www.w3.org/2000/svg", "text");
    val.setAttribute("x", String(padL + bw + 8));
    val.setAttribute("y", String(y + barH * 0.72));
    val.setAttribute("fill", "#555");
    val.setAttribute("font-size", "12");
    val.textContent = row.value.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
    svg.appendChild(val);
  });

  if (rows.length === 0) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", "16");
    t.setAttribute("y", String(h / 2));
    t.setAttribute("fill", "#777");
    t.setAttribute("font-size", "13");
    t.textContent = "No expense data for this period.";
    svg.appendChild(t);
  }
}

window.FinTrackCharts = { renderHorizontalBarChart };
