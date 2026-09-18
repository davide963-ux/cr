import "server-only";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { centsToUnits } from "./accountService";
import type { Withdrawal, WithdrawalStatus } from "./types";

/** Colonne lette ovunque: una sola definizione da tenere allineata. */
export const WITHDRAWAL_COLUMNS =
  "id, user_id, amount_cents, destination, note, status, decision_reason, decided_by, decided_at, created_at";

interface WithdrawalRow {
  id: string;
  amount_cents: number | null;
  destination: string | null;
  note: string | null;
  status: string | null;
  decision_reason: string | null;
  decided_at: string | null;
  created_at: string | null;
}

const STATUSES: WithdrawalStatus[] = ["pending", "approved", "rejected", "cancelled"];

/** Uno stato sconosciuto viene trattato come "in attesa": non si inventa un esito. */
function toStatus(value: string | null): WithdrawalStatus {
  return STATUSES.find((s) => s === value) ?? "pending";
}

export function toWithdrawal(row: WithdrawalRow): Withdrawal {
  return {
    id: row.id,
    amount: centsToUnits(row.amount_cents),
    destination: row.destination ?? "",
    note: row.note,
    status: toStatus(row.status),
    decisionReason: row.decision_reason,
    decidedAt: row.decided_at,
    createdAt: row.created_at ?? "",
  };
}

/**
 * Le richieste dell'utente collegato.
 *
 * Il filtro su user_id è ridondante rispetto alla policy RLS, ma esplicito:
 * se un giorno la policy cambiasse, questa query continuerebbe a restituire
 * soltanto le righe di chi sta guardando.
 */
export async function listOwnWithdrawals(limit = 20): Promise<Withdrawal[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("withdrawals")
    .select(WITHDRAWAL_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(toWithdrawal);
}

/**
 * Quanto è trattenuto dalle richieste ancora aperte.
 *
 * Non è un saldo separato: è la somma degli importi già sottratti da
 * `balance_cents`. Serve solo a mostrare dov'è finito quel denaro.
 */
export function heldTotal(withdrawals: Withdrawal[]): number {
  return withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amount, 0);
}

/**
 * Apre una richiesta. Il saldo viene trattenuto dalla funzione SQL nella
 * stessa transazione che crea la riga: o succede tutto, o non succede nulla.
 */
export async function requestWithdrawal(
  amountCents: number,
  destination: string,
  note: string | null,
): Promise<{ ok: true; id: string } | { ok: false; code: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("request_withdrawal", {
    amount_cents: amountCents,
    destination,
    user_note: note,
  });

  if (error) return { ok: false, code: error.code ?? "unknown" };
  return { ok: true, id: typeof data === "string" ? data : "" };
}

/** Ritira una propria richiesta ancora in attesa e si riprende l'importo. */
export async function cancelWithdrawal(
  id: string,
): Promise<{ ok: true } | { ok: false; code: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("cancel_withdrawal", { withdrawal_id: id });

  if (error) return { ok: false, code: error.code ?? "unknown" };
  return { ok: true };
}

