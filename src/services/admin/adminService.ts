import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { centsToUnits } from "@/services/account/accountService";
import type { AdminUserRow, AdminWithdrawal, LedgerEntry } from "@/services/account/types";
import { toWithdrawal, WITHDRAWAL_COLUMNS } from "@/services/account/withdrawalService";

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

/**
 * Tutte le richieste di prelievo, con l'utente accanto.
 *
 * L'utente arriva da una join su `profiles`: senza, il pannello mostrerebbe
 * un UUID. Le policy RLS restituiscono l'elenco completo solo a chi è
 * amministratore; a chiunque altro, soltanto le proprie righe.
 */
export async function listWithdrawals(limit = 100): Promise<AdminWithdrawal[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("withdrawals")
    .select(`${WITHDRAWAL_COLUMNS}, profiles!withdrawals_user_id_fkey (email, first_name, last_name)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => {
    // La join arriva come oggetto o come array di uno, a seconda di come
    // PostgREST deduce la cardinalità: normalizzata qui una volta sola.
    const joined = row.profiles as
      | { email: string | null; first_name: string | null; last_name: string | null }
      | { email: string | null; first_name: string | null; last_name: string | null }[]
      | null;
    const profile = Array.isArray(joined) ? joined[0] : joined;
    const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");

    return {
      ...toWithdrawal(row),
      userId: row.user_id,
      userEmail: profile?.email ?? "",
      userName: fullName || null,
      decidedBy: row.decided_by ?? null,
    };
  });
}

/**
 * Approva o rifiuta. Il saldo lo muove la funzione SQL, che blocca la riga
 * prima di leggerne lo stato: due amministratori sulla stessa richiesta si
 * mettono in fila, e il secondo riceve "già evasa" invece di sovrascrivere
 * la decisione del primo.
 */
export async function decideWithdrawal(
  id: string,
  approve: boolean,
  decision: string | null,
): Promise<{ ok: true; status: string } | { ok: false; code: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_decide_withdrawal", {
    withdrawal_id: id,
    approve,
    decision,
  });

  if (error) return { ok: false, code: error.code ?? "unknown" };
  return { ok: true, status: typeof data === "string" ? data : "" };
}
