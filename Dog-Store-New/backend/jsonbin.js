// JSONBin helper (stores all app data inside one bin)
// Env needed on Render/local:
//   JSONBIN_BIN_ID
//   JSONBIN_MASTER_KEY

const fetch = require('node-fetch');

const BIN_ID = process.env.JSONBIN_BIN_ID;
const MASTER_KEY = process.env.JSONBIN_MASTER_KEY;

if (!BIN_ID || !MASTER_KEY) {
  // Don't crash hard in dev when someone forgets env vars.
  // Routes will return a clear error instead.
}

const BASE_URL = (id) => `https://api.jsonbin.io/v3/b/${id}`;

async function jsonbinGetLatest() {
  if (!BIN_ID || !MASTER_KEY) {
    throw new Error('Missing JSONBIN_BIN_ID or JSONBIN_MASTER_KEY');
  }

  const res = await fetch(`${BASE_URL(BIN_ID)}/latest`, {
    headers: {
      'X-Master-Key': MASTER_KEY,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`JSONBin GET failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.record;
}

async function jsonbinPut(record) {
  if (!BIN_ID || !MASTER_KEY) {
    throw new Error('Missing JSONBIN_BIN_ID or JSONBIN_MASTER_KEY');
  }

  const res = await fetch(`${BASE_URL(BIN_ID)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': MASTER_KEY,
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`JSONBin PUT failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data;
}

async function ensureSeed() {
  const record = await jsonbinGetLatest();
  const next = {
    users: Array.isArray(record?.users) ? record.users : [],
  };

  // seed admin + demo user only if bin is empty
  if (next.users.length === 0) {
    next.users = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'password', role: 'user' },
    ];
    await jsonbinPut(next);
    return next;
  }

  // If record had extra fields, keep them (future proof)
  return { ...record, ...next };
}

module.exports = {
  jsonbinGetLatest,
  jsonbinPut,
  ensureSeed,
};
