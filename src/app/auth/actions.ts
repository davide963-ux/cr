"use server";

import { redirect } from "next/navigation";
import { authErrors } from "@/data/content";
import { sanitizeText } from "@/lib/sanitize";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
  notice?: string;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_TEXT_LENGTH = 80;

function readCredentials(formData: FormData): { email: string; password: string } | null {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return null;
  return { email, password };
}

function isValidEmail(email: string): boolean {
  // Deliberatamente permissiva: scarta gli errori di battitura evidenti,
  // senza inseguire la sintassi completa della RFC.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Accetta i formati internazionali senza imporne uno: prefisso, spazi, trattini. */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 8 && digits.length <= 15;
}

/** Percorsi interni soltanto: evita redirect verso domini esterni. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : AFTER_LOGIN_PATH;
}

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return { error: authErrors.notConfigured };

  const credentials = readCredentials(formData);
  if (!credentials) return { error: authErrors.missingFields };
  if (!isValidEmail(credentials.email)) return { error: authErrors.invalidEmail };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  // Messaggio unico per credenziali errate: non rivela quali email esistono.
  if (error) return { error: authErrors.badCredentials };

  redirect(safeNext(formData.get("next")));
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return { error: authErrors.notConfigured };

  const credentials = readCredentials(formData);
  if (!credentials) return { error: authErrors.missingFields };
  if (!isValidEmail(credentials.email)) return { error: authErrors.invalidEmail };
  if (credentials.password.length < MIN_PASSWORD_LENGTH) return { error: authErrors.weakPassword };

  // sanitizeText toglie tag e caratteri di controllo: questi valori verranno
  // poi mostrati nell'area riservata.
  const firstName = sanitizeText(formData.get("first_name"), MAX_TEXT_LENGTH);
  const lastName = sanitizeText(formData.get("last_name"), MAX_TEXT_LENGTH);
  const city = sanitizeText(formData.get("city"), MAX_TEXT_LENGTH);
  const phone = sanitizeText(formData.get("phone"), 25);

  if (!firstName || !lastName || !city || !phone) return { error: authErrors.missingProfileFields };
  if (!isValidPhone(phone)) return { error: authErrors.invalidPhone };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: {
      // Finiscono in user_metadata: nessuna tabella da creare. Attenzione:
      // l'utente può modificarli da sé, quindi non vanno usati per decisioni
      // di sicurezza. Per dati di cui fidarsi serve una tabella con RLS.
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        phone,
        city,
      },
    },
  });
  if (error) return { error: authErrors.signUpFailed };

  // Con la conferma via email attiva, Supabase non apre la sessione subito.
  if (!data.session) return { notice: authErrors.confirmEmail };

  redirect(AFTER_LOGIN_PATH);
}
