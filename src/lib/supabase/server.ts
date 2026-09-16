import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseConfig } from "./config";

/**
 * Client Supabase per Server Components, Server Actions e Route Handlers.
 * La sessione vive in cookie httpOnly gestiti da @supabase/ssr.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Da un Server Component i cookie sono in sola lettura: il refresh
          // della sessione avviene nel proxy, quindi qui si può ignorare.
        }
      },
    },
  });
}

/** Utente autenticato, o null. Verificato lato server contro Supabase. */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
