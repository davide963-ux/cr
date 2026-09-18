import { adminPage } from "@/data/content";
import type { AccountUser } from "@/services/account/types";

/**
 * Avviso mostrato quando il profilo non si è potuto leggere.
 *
 * Porta con sé il codice dell'errore, perché "esegui la migrazione" da solo
 * non basta: chi ha già eseguito la prima e si vede dire di eseguirla ancora
 * non ha modo di capire che a mancare è una colonna aggiunta da una
 * successiva. Il codice dice quale.
 */
export function MigrationNotice({ account }: { account: AccountUser }) {
  if (account.profileReady) return null;

  return (
    <div
      role="status"
      className="rounded-[var(--radius-card)] border border-[#E9A24B]/30 bg-[#E9A24B]/[0.08] p-4 text-sm text-[#E9A24B]"
    >
      <p className="font-medium">{adminPage.migrationTitle}</p>
      <p className="mt-1 text-[#E9A24B]/85">
        {account.profileError
          ? adminPage.migrationBodyWithCode.replace("{code}", account.profileError)
          : adminPage.migrationBody}
      </p>
    </div>
  );
}
