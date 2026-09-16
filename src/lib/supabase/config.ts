/**
 * Configurazione Supabase.
 *
 * Le due variabili sono pubbliche per progetto: la chiave "anon" è pensata per
 * girare nel browser ed è protetta dalle Row Level Security policy definite su
 * Supabase. La chiave "service_role" non va MAI usata qui.
 *
 * Finché non sono impostate, le pagine di accesso mostrano un avviso invece di
 * rompere la build: così il sito resta pubblicabile anche prima del setup.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Da usare solo dopo isSupabaseConfigured(). */
export function requireSupabaseConfig(): { url: string; anonKey: string } {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase non configurato: impostare NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

/** Dove finisce l'utente dopo l'accesso. */
export const AFTER_LOGIN_PATH = "/dashboard";
