import "server-only";
import { cache } from "react";
import { getCurrentUser } from "@/lib/supabase/server";
import type { AccountUser } from "./types";

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Traduce l'utente Supabase nella struttura usata dall'area riservata.
 *
 * Saldo e indirizzo wallet non arrivano da nessuna parte perché non esiste
 * ancora un sistema di pagamenti: restano 0 e null, e l'interfaccia mostra
 * stati vuoti onesti invece di numeri inventati. Quando il backend ci sarà,
 * è questa funzione a cambiare — non le pagine.
 */
export const getAccount = cache(async (): Promise<AccountUser | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  const firstName = readString(meta.first_name);
  const lastName = readString(meta.last_name);
  const email = user.email ?? "";

  return {
    id: user.id,
    username: readString(meta.full_name) ?? firstName ?? email.split("@")[0] ?? "",
    email,
    firstName,
    lastName,
    phone: readString(meta.phone),
    city: readString(meta.city),
    balance: 0,
    currency: "EUR",
    walletAddress: null,
    declaredAmount: typeof meta.amount === "number" ? meta.amount : null,
  };
});
