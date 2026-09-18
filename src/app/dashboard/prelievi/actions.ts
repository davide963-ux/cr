"use server";

import { revalidatePath } from "next/cache";
import { withdrawPage } from "@/data/content";
import { parseAmountToCents } from "@/lib/money";
import { sanitizeText } from "@/lib/sanitize";
import { getAccount } from "@/services/account/accountService";
import { cancelWithdrawal, requestWithdrawal } from "@/services/account/withdrawalService";

export interface WithdrawFormState {
  error?: string;
  success?: string;
}

/** Messaggio leggibile per ogni errore sollevato dalle funzioni SQL. */
function messageForCode(code: string): string {
  switch (code) {
    case "42501":
      return withdrawPage.errors.notAuthorised;
    case "23514":
      return withdrawPage.errors.insufficient;
    case "54000":
      return withdrawPage.errors.tooManyPending;
    case "22003":
      return withdrawPage.errors.outOfRange;
    case "22023":
      return withdrawPage.errors.invalidAmount;
    case "55000":
      return withdrawPage.errors.alreadyDecided;
    case "P0002":
      return withdrawPage.errors.notFound;
    case "42883":
    case "42P01":
      return withdrawPage.errors.migrationMissing;
    default:
      return withdrawPage.errors.generic;
  }
}

/**
 * Apre una richiesta di prelievo.
 *
 * I controlli qui servono a dare un messaggio utile subito; quelli che
 * contano sono dentro `request_withdrawal`, che blocca la riga del profilo
 * prima di leggere il saldo. Due invii simultanei non possono quindi passare
 * entrambi, per quanto vicini arrivino.
 */
export async function requestWithdrawalAction(
  _prev: WithdrawFormState,
  formData: FormData,
): Promise<WithdrawFormState> {
  const account = await getAccount();
  if (!account) return { error: withdrawPage.errors.notAuthorised };

  const amountCents = parseAmountToCents(String(formData.get("amount") ?? ""));
  // Un IBAN non contiene spazi significativi, ma le persone li scrivono:
  // sanitizeText li normalizza senza rifiutare l'inserimento.
  const destination = sanitizeText(formData.get("destination"), 200);
  const note = sanitizeText(formData.get("note"), 500);

  if (amountCents === null || amountCents <= 0) return { error: withdrawPage.errors.invalidAmount };
  if (!destination) return { error: withdrawPage.errors.destinationRequired };

  const result = await requestWithdrawal(amountCents, destination, note || null);
  if (!result.ok) return { error: messageForCode(result.code) };

  revalidatePath("/dashboard/prelievi");
  revalidatePath("/dashboard");
  return { success: withdrawPage.submitted };
}

/** Ritira una propria richiesta ancora in attesa. */
export async function cancelWithdrawalAction(
  _prev: WithdrawFormState,
  formData: FormData,
): Promise<WithdrawFormState> {
  const account = await getAccount();
  if (!account) return { error: withdrawPage.errors.notAuthorised };

  const id = String(formData.get("withdrawal_id") ?? "");
  if (!id) return { error: withdrawPage.errors.notFound };

  // La funzione SQL filtra anche per user_id: un id altrui non trova nulla.
  const result = await cancelWithdrawal(id);
  if (!result.ok) return { error: messageForCode(result.code) };

  revalidatePath("/dashboard/prelievi");
  revalidatePath("/dashboard");
  return { success: withdrawPage.cancelled };
}
