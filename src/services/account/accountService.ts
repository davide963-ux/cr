import "server-only";
import { cache } from "react";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import type { AccountUser, LedgerEntry } from "./types";

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/** I centesimi salvati nel database diventano euro solo per essere mostrati. */
export function centsToUnits(cents: number | null | undefined): number {
  return typeof cents === "number" ? cents / 100 : 0;
}

/**
 * Traduce l'utente Supabase nella struttura usata dall'area riservata.
 *
 * Saldo e ruolo arrivano dalla tabella `profiles`, non da `user_metadata`:
 * quest'ultimo è modificabile dall'utente stesso via API, quindi non può
 * decidere né quanto denaro ha né se è amministratore.
 *
 * Se la tabella non c'è ancora (migrazione non eseguita) si ripiega sui dati
 * anagrafici di `user_metadata` con `profileReady: false`, così il sito
 * continua a funzionare e l'interfaccia può dirlo apertamente.
 */
export const getAccount = cache(async (): Promise<AccountUser | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  const email = user.email ?? "";
  const metaFirstName = readString(meta.first_name);

  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, phone, city, balance_cents, currency, is_admin, declared_amount_cents")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return {
      id: user.id,
      username: readString(meta.full_name) ?? metaFirstName ?? email.split("@")[0] ?? "",
      email,
      firstName: metaFirstName,
      lastName: readString(meta.last_name),
      phone: readString(meta.phone),
      city: readString(meta.city),
      balance: 0,
      currency: "EUR",
      walletAddress: null,
      declaredAmount: typeof meta.amount === "number" ? meta.amount : null,
      isAdmin: false,
      profileReady: false,
    };
  }

  const firstName = readString(profile.first_name) ?? metaFirstName;
  const lastName = readString(profile.last_name) ?? readString(meta.last_name);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return {
    id: user.id,
    username: fullName || email.split("@")[0] || "",
    email,
    firstName,
    lastName,
    phone: readString(profile.phone),
    city: readString(profile.city),
    balance: centsToUnits(profile.balance_cents),
    currency: "EUR",
    walletAddress: null,
    declaredAmount:
      typeof profile.declared_amount_cents === "number" ? centsToUnits(profile.declared_amount_cents) : null,
    isAdmin: profile.is_admin === true,
    profileReady: true,
  };
});

/**
 * Movimenti dell'utente corrente. Le policy RLS restituiscono solo le righe
 * che gli appartengono, quindi qui non serve filtrare.
 */
export async function getOwnLedger(limit = 10): Promise<LedgerEntry[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("id, amount_cents, balance_after_cents, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    amount: centsToUnits(row.amount_cents),
    balanceAfter: centsToUnits(row.balance_after_cents),
    reason: row.reason ?? "",
    createdAt: row.created_at ?? "",
  }));
}

/**
 * Variazione degli ultimi sette giorni, calcolata sui movimenti reali.
 *
 * La percentuale ha senso solo se il saldo di partenza non era zero: su un
 * conto vuoto qualunque accredito sarebbe una crescita infinita, quindi in
 * quel caso resta null e l'interfaccia mostra solo l'importo.
 */
export async function getWeeklyChange(
  currentBalance: number,
): Promise<{ amount: number; percent: number | null } | null> {
  const supabase = await createSupabaseServerClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("ledger_entries")
    .select("amount_cents")
    .gte("created_at", since);

  if (error || !data || data.length === 0) return null;

  const amount = centsToUnits(data.reduce((sum, row) => sum + (row.amount_cents ?? 0), 0));
  const startBalance = currentBalance - amount;
  const percent = startBalance > 0 ? (amount / startBalance) * 100 : null;
  return { amount, percent };
}
