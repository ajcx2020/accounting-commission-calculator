function $(id) { return document.getElementById(id); }

const tabButtons = document.querySelectorAll(".tab-btn");
const calculators = document.querySelectorAll(".calc");
const noTab = $("no-tab-selected");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    calculators.forEach(c => c.classList.add("hidden"));
    noTab.style.display = "none";

    btn.classList.add("active");
    $(btn.dataset.tab).classList.remove("hidden");
  });
});

function money(n) {
  if (isNaN(n)) return "";
  return "$" + n.toFixed(2);
}

function pct(n) {
  if (isNaN(n)) return "";
  return (n * 100).toFixed(2) + "%";
}

function calcResidential() {
  const cost = parseFloat($("res-cost").value);
  const collected = parseFloat($("res-collected").value);
  const lead = $("res-lead").value;
  const truck = $("res-truck").value;
  const accel = parseFloat($("res-accel").value);

  if (!cost || !collected) return;

  let adjusted = cost;
  if (lead === "company") adjusted += 250;

  const profit = collected - adjusted;
  const margin = profit / collected;

  $("res-warning-low").style.display = margin < 0.22 ? "block" : "none";
  $("res-warning-high").style.display = margin > 0.60 ? "block" : "none";

  let base = 0;

  if (margin >= 0.60) base = lead === "company" ? 0.15 : 0.17;
  else if (margin >= 0.43) base = lead === "company" ? 0.10 : 0.12;
  else if (margin >= 0.33) base = lead === "company" ? 0.08 : 0.10;
  else if (margin >= 0.22) base = lead === "company" ? 0.035 : 0.055;
  else base = 0;

  if (truck === "yes") base -= 0.015;

  const finalPct = margin < 0.22 ? 0 : base + accel;
  const commission = collected * finalPct;

  $("res-adjusted").innerText = money(adjusted);
  $("res-profit").innerText = money(profit);
  $("res-margin").innerText = pct(margin);
  $("res-percent").innerText = pct(finalPct);
  $("res-commission").innerText = money(commission);
}

document.querySelectorAll("#res-cost, #res-collected, #res-lead, #res-truck, #res-accel")
  .forEach(el => el.addEventListener("input", calcResidential));

function calcCommercial() {
  const cost = parseFloat($("com-cost").value);
  const collected = parseFloat($("com-collected").value);
  const lead = $("com-lead").value;
  const pm = $("com-pm").value;

  if (!cost || !collected) return;

  const adjusted = cost;
  const profit = collected - cost;
  const margin = profit / collected;

  $("com-warning-low").style.display = margin < 0.15 ? "block" : "none";
  $("com-warning-high").style.display = margin > 0.60 ? "block" : "none";

  let base = 0;

  if (margin >= 0.61) base = 0.10;
  else if (margin >= 0.45) base = 0.07;
  else if (margin >= 0.35) base = 0.05;
  else if (margin >= 0.25) base = 0.04;
  else if (margin >= 0.15) base = 0.03;
  else base = 0;

  let bonus = 0;

  if (lead === "self") bonus += 0.01;
  if (pm === "yes") bonus += 0.01;

  const finalPct = margin < 0.15 ? 0 : base + bonus;
  const commission = finalPct * collected;

  $("com-adjusted").innerText = money(adjusted);
  $("com-profit").innerText = money(profit);
  $("com-margin").innerText = pct(margin);
  $("com-percent").innerText = pct(finalPct);
  $("com-commission").innerText = money(commission);
}

document.querySelectorAll("#com-cost, #com-collected, #com-lead, #com-pm")
  .forEach(el => el.addEventListener("input", calcCommercial));

function calcWater() {
  const cost = parseFloat($("wat-cost").value);
  const collected = parseFloat($("wat-collected").value);

  if (!cost || !collected) return;

  const profit = collected - cost;
  const margin = profit / collected;
  const commission = profit * 0.10;

  $("wat-profit").innerText = money(profit);
  $("wat-margin").innerText = pct(margin);
  $("wat-commission").innerText = money(commission);
}

document.querySelectorAll("#wat-cost, #wat-collected")
  .forEach(el => el.addEventListener("input", calcWater));
