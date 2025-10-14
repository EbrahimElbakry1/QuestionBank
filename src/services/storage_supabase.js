// src/services/storage_supabase.js
import { supabase } from "./supabaseClient.js";

/* ===========================================================================
   Auth helpers
   - Accepts either an email ("user@site.com") or a plain username ("user")
   - For plain usernames we map to user@wizara.local so Supabase Auth works
=========================================================================== */
function toEmail(identifier) {
  if (!identifier) return "";
  return identifier.includes("@") ? identifier : `${identifier}@wizara.local`;
}

// Optional UI helpers (only used if your app still stores/display names locally)
export function cacheUsername(name) {
  sessionStorage.setItem("wizara:username", name);
}
export function currentUser() {
  // If you're using useAuth() with Supabase directly, prefer supabase.auth.getSession()
  return sessionStorage.getItem("wizara:username") || null;
}

export async function signUp(identifier, password) {
  const email = toEmail(identifier);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);

  // create/patch profile row (optional)
  const userId = data.user?.id;
  const username = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  if (userId) {
    const { error: pErr } = await supabase
      .from("profile")
      .upsert({ user_id: userId, username }, { onConflict: "user_id" });
    if (pErr) throw new Error(pErr.message);
  }
  cacheUsername(username);
  return username;
}

export async function login(identifier, password) {
  const email = toEmail(identifier);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  const username = identifier.includes("@") ? identifier.split("@")[0] : identifier;
  cacheUsername(username);
  return username;
}

export async function logout() {
  await supabase.auth.signOut();
  sessionStorage.removeItem("wizara:username");
}

/* ===========================================================================
   Internal helpers
=========================================================================== */
async function getUserId() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  const uid = data.session?.user?.id;
  if (!uid) throw new Error("Not authenticated");
  return uid;
}

// Stable question id when no explicit id is provided
function qid(q) {
  if (q?.id != null) return String(q.id);
  const s = (q?.question || "") + "||" + (q?.choices || []).join("|");
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
  return String(h);
}

/* ===========================================================================
   Mistakes (per-user, per-subject)
   Tables expected: public.mistakes (with RLS for auth.uid())
=========================================================================== */
export async function addMistakes(_username, subject, questionsArray) {
  const user_id = await getUserId();
  const rows = (questionsArray || []).map(q => ({
    user_id,
    subject,
    question_id: qid(q),
    question_json: q,
    times_wrong: 1,
  }));
  if (!rows.length) return;

  // Upsert base rows
  const { error } = await supabase
    .from("mistakes")
    .upsert(rows, { onConflict: "user_id,subject,question_id" });
  if (error) throw new Error(error.message);

  // Optionally increment counter via RPC if you created the function
  for (const r of rows) {
    await supabase
      .rpc("increment_mistake_count", {
        p_user_id: user_id,
        p_subject: subject,
        p_question_id: r.question_id,
        p_question_json: r.question_json,
      })
      .catch(() => {}); // ignore if function not installed
  }
}

export async function getMistakes(_username, subject) {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from("mistakes")
    .select("question_id, question_json, times_wrong, updated_at")
    .eq("user_id", user_id)
    .eq("subject", subject)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data || []).map(r => ({
    ...r.question_json,
    id: r.question_id,
    timesWrong: r.times_wrong,
    updatedAt: r.updated_at,
  }));
}

export async function removeMistakeIds(_username, subject, ids) {
  const user_id = await getUserId();
  if (!ids?.length) return;
  const { error } = await supabase
    .from("mistakes")
    .delete()
    .eq("user_id", user_id)
    .eq("subject", subject)
    .in("question_id", ids);
  if (error) throw new Error(error.message);
}

export async function clearAllMistakes(_username, subject) {
  const user_id = await getUserId();
  const { error } = await supabase
    .from("mistakes")
    .delete()
    .eq("user_id", user_id)
    .eq("subject", subject);
  if (error) throw new Error(error.message);
}

/* ===========================================================================
   Seen questions (avoid repeats)
   Tables expected: public.seen (with RLS)
=========================================================================== */
export async function getSeen(_username, subject) {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from("seen")
    .select("question_id")
    .eq("user_id", user_id)
    .eq("subject", subject);
  if (error) throw new Error(error.message);
  return new Set((data || []).map(r => r.question_id));
}

export async function addSeen(_username, subject, ids) {
  const user_id = await getUserId();
  const rows = (ids || []).map(id => ({
    user_id,
    subject,
    question_id: String(id),
  }));
  if (!rows.length) return;
  const { error } = await supabase
    .from("seen")
    .upsert(rows, { onConflict: "user_id,subject,question_id" });
  if (error) throw new Error(error.message);
}

export async function clearSeen(_username, subject) {
  const user_id = await getUserId();
  const { error } = await supabase
    .from("seen")
    .delete()
    .eq("user_id", user_id)
    .eq("subject", subject);
  if (error) throw new Error(error.message);
}

/* ===========================================================================
   Ping (optional sanity check)
=========================================================================== */
export async function ping() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return !!data.session;
}
