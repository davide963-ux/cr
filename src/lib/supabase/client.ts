"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseConfig } from "./config";

/** Client Supabase per il browser: avvia l'OAuth e legge la sessione corrente. */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
