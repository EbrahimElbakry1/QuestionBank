// src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: these names must match your .env.local keys exactly
const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helpful debug – shows if envs are loading (key is partially masked)
console.log("VITE_SUPABASE_URL =", url);
console.log(
  "VITE_SUPABASE_ANON_KEY =",
  typeof anon === "string" ? anon.slice(0, 8) + "..." : anon
);

export const supabase = createClient(url, anon);
