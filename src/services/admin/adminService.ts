import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { centsToUnits } from "@/services/account/accountService";
import type { AdminUserRow, LedgerEntry } from "@/services/account/types";

/**
 * Elenco completo degli utenti.
 *
 * Non serve filtrare per ruolo: le policy RLS restituiscono tutte le righe
 * solo a chi è amministratore, e a chiunque altro soltanto la propria. Il
 * database è l'ultima parola, non questa funzione.
 */
export async function listUsers(): Promise<AdminUserRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, phone, city, balance_cents, currency, is_admin, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ");
    return {
      id: row.id,
      email: row.email ?? "",
      fullName: fullName || null,
      phone: row.phone ?? null,
      city: row.city ?? null,
      balance: centsToUnits(row.balance_cents),
      currency: row.currency ?? "EUR",
      isAdmin: row.is_admin === true,
      createdAt: row.created_at ?? "",
    };
  });
}

/** Ultimi movimenti registrati, di tutti gli utenti. */
export async function listRecentLedger(limit = 20): Promise<(LedgerEntry & { userId: string })[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ledger_entries")
    .select("id, user_id, amount_cents, balance_after_cents, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    amount: centsToUnits(row.amount_cents),
    balanceAfter: centsToUnits(row.balance_after_cents),
    reason: row.reason ?? "",
    createdAt: row.created_at ?? "",
  }));
}

/**
 * Accredito o addebito. Il lavoro vero lo fa `admin_adjust_balance` nel
 * database: aggiorna il saldo e scrive il registro in un'unica transazione,
 * e verifica da sé che chi chiama sia un amministratore.
 */
export async function adjustBalance(
  targetUserId: string,
  deltaCents: number,
  reason: string,
): Promise<{ ok: true; balance: number } | { ok: false; code: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_adjust_balance", {
    target_user: targetUserId,
    delta_cents: deltaCents,
    adjust_reason: reason,
  });

  if (error) return { ok: false, code: error.code ?? "unknown" };
  return { ok: true, balance: centsToUnits(typeof data === "number" ? data : 0) };
}

/** Promuove o revoca un amministratore, sempre passando dal database. */
export async function setAdmin(
  targetUserId: string,
  makeAdmin: boolean,
): Promise<{ ok: true } | { ok: false; code: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_admin", {
    target_user: targetUserId,
    make_admin: makeAdmin,
  });

  if (error) return { ok: false, code: error.code ?? "unknown" };
  return { ok: true };
}
