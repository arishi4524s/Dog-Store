const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { jsonbinGetLatest, jsonbinPut, ensureSeed } = require('./jsonbin');

const app = express();
app.use(cors());
app.use(express.json());

// Serve the static website (dog-store folder)
const staticDir = path.join(__dirname, '..', 'dog-store');
app.use(express.static(staticDir));

// Helpers
function sanitizeUser(user) {
  // ⚠️ This is demo-level auth (plain passwords). For production, use hashing.
  return { username: user.username, role: user.role };
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Register
app.post('/api/register', async (req, res) => {
  try {
    await ensureSeed();

    const { username, password } = req.body || {};
    const u = (username || '').trim();
    const p = password || '';

    if (!u || !p) {
      return res.status(400).json({ message: 'username and password required' });
    }

    const record = await jsonbinGetLatest();
    const users = Array.isArray(record.users) ? record.users : [];

    if (users.some((x) => x.username === u)) {
      return res.status(409).json({ message: 'username already exists' });
    }

    const newUser = { username: u, password: p, role: 'user' };
    const next = { ...record, users: [...users, newUser] };
    await jsonbinPut(next);

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    await ensureSeed();

    const { username, password } = req.body || {};
    const u = (username || '').trim();
    const p = password || '';

    const record = await jsonbinGetLatest();
    const users = Array.isArray(record.users) ? record.users : [];

    const found = users.find((x) => x.username === u && x.password === p);
    if (!found) return res.status(401).json({ message: 'Invalid username or password' });

    return res.json(sanitizeUser(found));
  } catch (err) {
    return res.status(500).json({ message: err.message || 'server error' });
  }
});

// SPA-ish fallback: open index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
