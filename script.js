/* script.js - rebuilt polished dashboard */

/* ---------- Demo data ---------- */
const demoBooks = [
  { id: 1001, title: "Atomic Habits", author: "James Clear", issuedTo: null },
  {
    id: 1002,
    title: "Clean Code",
    author: "Robert C. Martin",
    issuedTo: "Rahul",
  },
  {
    id: 1003,
    title: "Introduction to Algorithms",
    author: "CLRS",
    issuedTo: null,
  },
  {
    id: 1004,
    title: "Operating Systems",
    author: "A. Silberschatz",
    issuedTo: "Priya",
  },
  { id: 1005, title: "Digital Design", author: "M. Morris", issuedTo: null },
  {
    id: 1006,
    title: "Database Systems",
    author: "Ramakrishnan",
    issuedTo: "Aman",
  },
];

const demoIssues = [
  {
    member: "#586475",
    bookId: "PHY-TXT-0099",
    title: "Atomic Habits",
    issueDate: "24/04/2025",
    returnDate: "08/05/2025",
    status: "Issued",
  },
  {
    member: "#845234",
    bookId: "ENG-TXT-0102",
    title: "Clean Code",
    issueDate: "24/04/2025",
    returnDate: "08/05/2025",
    status: "Issued",
  },
  {
    member: "#457821",
    bookId: "EEE-RFR-0100",
    title: "Introduction to Algorithms",
    issueDate: "24/04/2025",
    returnDate: "08/05/2025",
    status: "Returned",
  },
  {
    member: "#564213",
    bookId: "CSE-LAB-0021",
    title: "Operating Systems",
    issueDate: "24/04/2025",
    returnDate: "08/05/2025",
    status: "Overdue",
  },
  {
    member: "#789542",
    bookId: "HIS-RFR-0089",
    title: "Database Systems",
    issueDate: "24/04/2025",
    returnDate: "08/05/2025",
    status: "Issued",
  },
];

const demoAlerts = [
  { when: "Today", member: "#895467", bookId: "PHS-TXT-0042", type: "Student" },
  {
    when: "Overdue",
    member: "#784511",
    bookId: "DRA-TXT-0505",
    type: "Student",
  },
  {
    when: "Recent Return",
    member: "#985470",
    bookId: "EEE-TXT-0100",
    type: "Student",
  },
  {
    when: "Overdue",
    member: "#896402",
    bookId: "CSE-LAB-0028",
    type: "Student",
  },
];

const demoEvents = [
  {
    title: "Campus Chapters Book Club",
    info: "Meetup on 25/04",
    time: "2:30PM - 3:30PM",
  },
  {
    title: "Clean Code by Robert C. Martin",
    info: "#975400 Reserved",
    time: "To be returned on 29/04",
  },
  {
    title: "Book Launch: Electric Monkey Publication",
    info: "Launch event on 02/05",
    time: "12:00 PM - 04:00 PM",
  },
];

/* ---------- persist demo data (first run) ---------- */
if (!localStorage.getItem("lms_demo_books"))
  localStorage.setItem("lms_demo_books", JSON.stringify(demoBooks));
if (!localStorage.getItem("lms_demo_issues"))
  localStorage.setItem("lms_demo_issues", JSON.stringify(demoIssues));
if (!localStorage.getItem("lms_demo_alerts"))
  localStorage.setItem("lms_demo_alerts", JSON.stringify(demoAlerts));
if (!localStorage.getItem("lms_demo_events"))
  localStorage.setItem("lms_demo_events", JSON.stringify(demoEvents));

/* ---------- helpers ---------- */
const getData = (key) => JSON.parse(localStorage.getItem(key) || "[]");

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ---------- render stats ---------- */
function renderStats() {
  const books = getData("lms_demo_books");
  const issues = getData("lms_demo_issues");
  const available = books.filter((b) => !b.issuedTo).length;
  const issued = books.filter((b) => b.issuedTo).length;
  const overdue = issues.filter(
    (i) => i.status && i.status.toLowerCase().includes("overdue")
  ).length;

  document.getElementById("statAvailable").innerText = available;
  document.getElementById("statIssued").innerText = issued;
  document.getElementById("statOverdue").innerText = overdue;
  document.getElementById("recentCount").innerText = issues.length + " records";
}

/* ---------- render recent issues ---------- */
function renderRecentTable(rows) {
  const issues = rows || getData("lms_demo_issues");
  const tbody = document.querySelector("#recentTable tbody");
  tbody.innerHTML = "";
  issues.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="muted">${escapeHtml(r.member)}</td>
                    <td>${escapeHtml(r.bookId)}</td>
                    <td>${escapeHtml(r.title)}</td>
                    <td>${escapeHtml(r.issueDate)}</td>
                    <td>${escapeHtml(r.returnDate)}</td>
                    <td>${renderStatus(r.status)}</td>`;
    tbody.appendChild(tr);
  });
}
function renderStatus(s) {
  if (!s) return "";
  s = s.toLowerCase();
  if (s.includes("issued"))
    return `<span class="status-pill pill-issued">Issued</span>`;
  if (s.includes("overdue"))
    return `<span class="status-pill pill-overdue">Overdue</span>`;
  if (s.includes("returned"))
    return `<span class="status-pill pill-available">Returned</span>`;
  return `<span class="status-pill" style="background:rgba(255,255,255,0.06)">${escapeHtml(
    s
  )}</span>`;
}

/* ---------- render alerts ---------- */
function renderAlerts(rows) {
  const alerts = rows || getData("lms_demo_alerts");
  const tbody = document.querySelector("#alertsTable tbody");
  tbody.innerHTML = "";
  alerts.forEach((a) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(a.when)}</td><td>${escapeHtml(
      a.member
    )}</td><td>${escapeHtml(a.bookId)}</td><td>${escapeHtml(a.type)}</td>`;
    tbody.appendChild(tr);
  });
}

/* ---------- render events ---------- */
function renderEvents() {
  const ev = getData("lms_demo_events");
  const container = document.getElementById("eventsList");
  container.innerHTML = "";
  ev.forEach((e) => {
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `<div><strong style="color:#dff8ff">${escapeHtml(
      e.title
    )}</strong><div class="muted">${escapeHtml(
      e.info
    )}</div></div><div class="muted">${escapeHtml(e.time)}</div>`;
    container.appendChild(div);
  });
}

/* ---------- Chart (donut) ---------- */
let donutChart = null;
function createDonut() {
  const ctx = document.getElementById("donutChart").getContext("2d");
  const data = {
    labels: ["Books Issued", "New Books", "Book Overdue", "Books Lost"],
    datasets: [
      {
        data: [48, 25, 32, 5],
        backgroundColor: ["#00c1ff", "#f59e0b", "#7c3aed", "#ef4444"],
      },
    ],
  };
  donutChart = new Chart(ctx, {
    type: "doughnut",
    data,
    options: {
      cutout: "62%",
      plugins: { legend: { display: false } },
      maintainAspectRatio: true,
    },
  });

  // legend
  const legend = document.getElementById("donutLegend");
  legend.innerHTML = "";
  data.labels.forEach((lab, i) => {
    const row = document.createElement("div");
    row.className = "legend-item";
    row.innerHTML = `<div style="display:flex;gap:10px;align-items:center"><div style="width:12px;height:12px;background:${data.datasets[0].backgroundColor[i]};border-radius:3px"></div><div><strong>${data.datasets[0].data[i]}%</strong><div class="muted">${lab}</div></div></div>`;
    legend.appendChild(row);
  });
}

/* ---------- search ---------- */
function handleSearch(q) {
  q = (q || "").toLowerCase().trim();
  const issues = getData("lms_demo_issues").filter((r) => {
    return (
      r.title.toLowerCase().includes(q) ||
      r.bookId.toLowerCase().includes(q) ||
      r.member.toLowerCase().includes(q)
    );
  });
  renderRecentTable(issues);

  const alerts = getData("lms_demo_alerts").filter((a) => {
    return (
      a.member.toLowerCase().includes(q) ||
      a.bookId.toLowerCase().includes(q) ||
      a.when.toLowerCase().includes(q)
    );
  });
  renderAlerts(alerts);
}

/* ---------- profile menu & misc ---------- */
function toggleProfileMenu() {
  const m = document.getElementById("profileMenu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}
document.addEventListener("click", (e) => {
  const menu = document.getElementById("profileMenu");
  if (!menu) return;
  if (!e.target.closest(".profile")) menu.style.display = "none";
});

function openSettings() {
  alert("Settings (demo)");
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
  if (document.body.classList.contains("light-theme")) {
    document.documentElement.style.setProperty("--bg", "#f3f7fb");
    document.documentElement.style.setProperty("--muted", "#5b6b7a");
    document.body.style.color = "#04203b";
  } else {
    document.documentElement.style.setProperty("--bg", "#0f1115");
    document.documentElement.style.setProperty("--muted", "#93a1b2");
    document.body.style.color = "#dbe7ff";
  }
}

/* ---------- top clock ---------- */
function updateClock() {
  const d = new Date();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString();
  const top = document.getElementById("topDateTime");
  const last = document.getElementById("lastUpdated");
  if (top) top.innerText = `${time} • ${date}`;
  if (last) last.innerText = `${time} ${date}`;
}

/* ---------- nav buttons ---------- */
document.querySelectorAll(".rail-btn").forEach((b) => {
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".rail-btn")
      .forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
  });
});

/* ---------- init ---------- */
function init() {
  renderStats();
  renderRecentTable();
  renderAlerts();
  renderEvents();
  createDonut();
  updateClock();
  setInterval(updateClock, 60 * 1000);
}
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", init);
else init();

/* expose search for inline handler */
window.handleSearch = handleSearch;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleTheme = toggleTheme;
window.openSettings = openSettings;

const searchBox = document.querySelector(".search-expand");
const searchToggle = document.querySelector(".search-toggle");

searchToggle.addEventListener("click", () => {
  searchBox.classList.toggle("active");
});
