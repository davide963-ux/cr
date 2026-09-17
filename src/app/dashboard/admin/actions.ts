"use server";

import { revalidatePath } from "next/cache";
import { adminPage } from "@/data/content";
import { parseAmountToCents } from "@/lib/money";
import { sanitizeText } from "@/lib/sanitize";
import { getAccount } from "@/services/account/accountService";
import { adjustBalance, setAdmin } from "@/services/admin/adminService";

export interface AdminFormState {
  error?: string;
  success?: string;
}

/** Messaggio leggibile per ogni errore sollevato dalla funzione SQL. */
function messageForCode(code: string): string {
  switch (code) {
    case "42501":
      return adminPage.errors.notAuthorised;
    case "23514":
      return adminPage.errors.constraint;
    case "P0002":
      return adminPage.errors.userNotFound;
    case "22003":
      return adminPage.errors.outOfRange;
    case "22023":
      return adminPage.errors.invalidInput;
    case "42883":
    case "42P01":
      return adminPage.errors.migrationMissing;
    default:
      return adminPage.errors.generic;
  }
}

export async function adjustBalanceAction(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  // Prima barriera. Quella che conta davvero è dentro la funzione SQL,
  // che rifiuta la chiamata se chi la fa non è amministratore.
  const account = await getAccount();
  if (!account?.isAdmin) return { error: adminPage.errors.notAuthorised };

  const targetUserId = String(formData.get("user_id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const reason = sanitizeText(formData.get("reason"), 500);
  const amountCents = parseAmountToCents(String(formData.get("amount") ?? ""));

  if (!targetUserId) return { error: adminPage.errors.userNotFound };
  if (direction !== "credit" && direction !== "debit") return { error: adminPage.errors.invalidInput };
  if (amountCents === null || amountCents === 0) return { error: adminPage.errors.invalidAmount };
  if (!reason) return { error: adminPage.errors.reasonRequired };

  const delta = direction === "credit" ? amountCents : -amountCents;
  const result = await adjustBalance(targetUserId, delta, reason);
  if (!result.ok) return { error: messageForCode(result.code) };

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard");
  return { success: adminPage.adjustDone };
}

export async function setAdminAction(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const account = await getAccount();
  if (!account?.isAdmin) return { error: adminPage.errors.notAuthorised };

  const targetUserId = String(formData.get("user_id") ?? "");
  const makeAdmin = String(formData.get("make_admin") ?? "") === "true";
  if (!targetUserId) return { error: adminPage.errors.userNotFound };

  const result = await setAdmin(targetUserId, makeAdmin);
  if (!result.ok) return { error: messageForCode(result.code) };

  revalidatePath("/dashboard/admin");
  return { success: adminPage.roleDone };
}
