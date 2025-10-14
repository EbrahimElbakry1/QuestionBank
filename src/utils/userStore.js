// src/utils/userStore.js

const KEY_USERS = "users";              // { [username]: { passwordHash: string } }
const KEY_SESSION = "session:user";     // "username"
const KEY_MISTAKES_PREFIX = "mistakes"; // mistakes:<username>:<subject> = [question objects]

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ========== Auth ========== */
export function signUp(username, password) {
  if (!password) throw new Error("Password is required.");
  const users = readJSON(KEY_USERS, {});
  if (users[username]) throw new Error("Username already exists.");
  users[username] = { passwordHash: btoa(password) }; // demo only
  writeJSON(KEY_USERS, users);
  localStorage.setItem(KEY_SESSION, username);
  return username;
}

export function login(username, password) {
  const users = readJSON(KEY_USERS, {});
  const rec = users[username];
  if (!rec) throw new Error("User not found.");
  if (!password || btoa(password) !== rec.passwordHash) {
    throw new Error("Invalid credentials.");
  }
  localStorage.setItem(KEY_SESSION, username);
  return username;
}

export function logout() {
  localStorage.removeItem(KEY_SESSION);
}

export function currentUser() {
  return localStorage.getItem(KEY_SESSION) || null;
}

/* ========== Helpers for Mistakes ========== */
function mistakesKey(username, subject) {
  return `${KEY_MISTAKES_PREFIX}:${username}:${subject}`;
}

// tiny hash for stable ids
function _hash(str) {
  let h = 0, i = 0;
  while (i < str.length) { h = (h << 5) - h + str.charCodeAt(i++); h |= 0; }
  return String(h);
}
function _ensureId(q) {
  if (q && q.id) return q;
  const question = String(q?.question ?? "");
  const choices = Array.isArray(q?.choices) ? q.choices.join("|") : "";
  const id = _hash(question + "||" + choices);
  return { ...q, id };
}

/* ========== Mistakes API ========== */
export function addMistakes(username, subject, questionsArray) {
  const key = mistakesKey(username, subject);
  const existing = readJSON(key, []);

  const fixedIncoming = (Array.isArray(questionsArray) ? questionsArray : []).map(_ensureId);
  const fixedExisting = (Array.isArray(existing) ? existing : []).map(_ensureId);

  const byId = new Map(fixedExisting.map(q => [q.id, q]));
  fixedIncoming.forEach(q => byId.set(q.id, q));

  writeJSON(key, Array.from(byId.values()));
}

export function getMistakes(username, subject) {
  const key = mistakesKey(username, subject);
  const raw = readJSON(key, []);

  const fixed = (Array.isArray(raw) ? raw : []).map(_ensureId);
  const byId = new Map(fixed.map(q => [q.id, q]));
  const list = Array.from(byId.values());

  // migration: rewrite repaired items
  writeJSON(key, list);

  return list;
}

export function removeMistakeIds(username, subject, idsToRemove) {
  const key = mistakesKey(username, subject);
  const existing = readJSON(key, []);
  const next = existing.filter(q => !idsToRemove.includes(q.id));
  writeJSON(key, next);
}

export function clearAllMistakes(username, subject) {
  localStorage.removeItem(mistakesKey(username, subject));
}
