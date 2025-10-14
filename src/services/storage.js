// src/services/storage.js
// ✅ Always use the Supabase adapter for now.
// This removes the dynamic import issue (./storage_local missing).

import * as cloud from "./storage_supabase.js";

export const storage = cloud;
