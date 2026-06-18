const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory store
const enquiries = [];

// Validation helper
function validateEnquiry({ name, email, phone }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = "Name must be at least 2 characters.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) errors.email = "A valid email address is required.";
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) errors.phone = "A valid 10-digit Indian phone number is required.";
  return errors;
}

// POST /api/enquiry
app.post("/api/enquiry", (req, res) => {
  const { name, email, phone } = req.body;
  const errors = validateEnquiry({ name, email, phone });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }
  const record = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    registeredAt: new Date().toISOString(),
    workshop: "AI & Robotics Summer Workshop",
  };
  enquiries.push(record);
  console.log(`[Enquiry] New registration from ${record.name} — ${record.email}`);
  return res.status(201).json({
    success: true,
    message: `Thanks ${record.name}! You're registered. We'll reach you at ${record.email} shortly.`,
    data: { id: record.id, registeredAt: record.registeredAt },
  });
});

// GET /api/enquiries — all registrations
app.get("/api/enquiries", (req, res) => {
  res.json({ success: true, total: enquiries.length, data: enquiries });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", totalEnquiries: enquiries.length });
});

// ── ADMIN DASHBOARD (built-in HTML) ──
app.get("/admin", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Admin — Kidrove Registrations</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Syne:wght@800&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --ink:#0D0F1A;--surface:#F7F8FC;--card:#fff;
      --violet:#5B3AFF;--violet-bg:#EDE8FF;
      --mint:#00C9A7;--coral:#FF5C3A;--gold:#FFB830;
      --muted:#6B7280;--border:#E5E7EB;
    }
    body{font-family:'Space Grotesk',sans-serif;background:var(--surface);color:var(--ink);min-height:100vh}
    header{background:var(--ink);padding:20px 5%;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
    .logo{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#fff}
    .logo span{color:#7B5FFF}
    .header-right{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
    .badge{background:rgba(0,201,167,0.2);color:var(--mint);border:1px solid rgba(0,201,167,0.4);border-radius:50px;padding:5px 14px;font-size:0.8rem;font-weight:700;letter-spacing:0.04em}
    .refresh-btn{background:var(--violet);color:#fff;border:none;border-radius:50px;padding:8px 20px;font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;transition:background 0.2s}
    .refresh-btn:hover{background:#7B5FFF}
    main{padding:40px 5%}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:36px}
    .stat-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;text-align:center}
    .stat-num{font-family:'Syne',sans-serif;font-size:2.4rem;font-weight:800;color:var(--violet)}
    .stat-label{font-size:0.8rem;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-top:4px}
    .section-title{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;margin-bottom:16px}
    .table-wrap{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;overflow-x:auto}
    table{width:100%;border-collapse:collapse;min-width:600px}
    thead{background:var(--ink)}
    thead th{color:#fff;padding:14px 20px;text-align:left;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap}
    tbody tr{border-bottom:1px solid var(--border);transition:background 0.15s}
    tbody tr:last-child{border-bottom:none}
    tbody tr:hover{background:#F3F0FF}
    td{padding:14px 20px;font-size:0.9rem;vertical-align:middle}
    .td-name{font-weight:700;color:var(--ink)}
    .td-email{color:var(--muted)}
    .td-phone{font-family:monospace;font-size:0.88rem}
    .td-time{color:var(--muted);font-size:0.82rem;white-space:nowrap}
    .td-id{color:var(--muted);font-size:0.75rem;font-family:monospace}
    .avatar{width:34px;height:34px;border-radius:50%;background:var(--violet-bg);color:var(--violet);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;margin-right:10px;flex-shrink:0}
    .name-cell{display:flex;align-items:center}
    .empty{text-align:center;padding:60px 20px;color:var(--muted)}
    .empty-icon{font-size:2.5rem;margin-bottom:12px}
    .empty p{font-size:0.95rem}
    .workshop-tag{display:inline-block;background:var(--violet-bg);color:var(--violet);border-radius:50px;padding:3px 12px;font-size:0.75rem;font-weight:700}
    .loading{text-align:center;padding:40px;color:var(--muted);font-size:0.95rem}
  </style>
</head>
<body>
<header>
  <div class="logo">kid<span>rove</span> <span style="color:rgba(255,255,255,0.4);font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:400">/ Admin</span></div>
  <div class="header-right">
    <div class="badge" id="live-badge">● LIVE</div>
    <button class="refresh-btn" onclick="load()">↻ Refresh</button>
  </div>
</header>

<main>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-num" id="total">—</div>
      <div class="stat-label">Total Registrations</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--mint)" id="today">—</div>
      <div class="stat-label">Registered Today</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" style="color:var(--coral)" id="seats">—</div>
      <div class="stat-label">Seats Remaining</div>
    </div>
  </div>

  <div class="section-title">All Registrations</div>
  <div class="table-wrap">
    <div class="loading" id="loading">Loading registrations…</div>
    <table id="table" style="display:none">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Workshop</th>
          <th>Registered At</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
    <div class="empty" id="empty" style="display:none">
      <div class="empty-icon">📭</div>
      <p>No registrations yet.<br/>Submit the form and they'll appear here.</p>
    </div>
  </div>
</main>

<script>
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) +
      ' · ' + d.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'});
  }
  function initials(name) {
    return name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  }
  function isToday(iso) {
    const d = new Date(iso), now = new Date();
    return d.getDate()===now.getDate() && d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }

  async function load() {
    try {
      const res = await fetch('/api/enquiries');
      const data = await res.json();
      const list = data.data || [];

      document.getElementById('total').textContent = list.length;
      document.getElementById('today').textContent = list.filter(r => isToday(r.registeredAt)).length;
      document.getElementById('seats').textContent = Math.max(0, 30 - list.length);
      document.getElementById('loading').style.display = 'none';

      if (list.length === 0) {
        document.getElementById('empty').style.display = 'block';
        document.getElementById('table').style.display = 'none';
        return;
      }

      document.getElementById('empty').style.display = 'none';
      document.getElementById('table').style.display = 'table';

      const tbody = document.getElementById('tbody');
      tbody.innerHTML = [...list].reverse().map((r, i) => \`
        <tr>
          <td class="td-id">\${list.length - i}</td>
          <td><div class="name-cell"><div class="avatar">\${initials(r.name)}</div><span class="td-name">\${r.name}</span></div></td>
          <td class="td-email">\${r.email}</td>
          <td class="td-phone">\${r.phone}</td>
          <td><span class="workshop-tag">AI & Robotics</span></td>
          <td class="td-time">\${formatDate(r.registeredAt)}</td>
          <td class="td-id">\${r.id}</td>
        </tr>
      \`).join('');
    } catch(e) {
      document.getElementById('loading').textContent = 'Could not load data. Is the server running?';
    }
  }

  load();
  setInterval(load, 10000); // auto-refresh every 10 seconds
</script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard → http://localhost:${PORT}/admin`);
});
