import { withdrawPage } from "@/data/content";
import { cn } from "@/lib/cn";
import type { WithdrawalStatus as Status } from "@/services/account/types";

/**
 * Etichetta di stato.
 *
 * Il colore non è l'unico indicatore: c'è sempre la parola. Chi non distingue
 * il verde dal rosso legge comunque "Approvata" o "Rifiutata".
 */
const TONE: Record<Status, string> = {
  pending: "border-[#E9A24B]/30 bg-[#E9A24B]/10 text-[#E9A24B]",
  approved: "border-mint/30 bg-mint/10 text-mint",
  rejected: "border-loss/30 bg-loss/10 text-loss",
  cancelled: "border-line-strong bg-panel-raised text-mist",
};

export function WithdrawalStatus({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE[status],
      )}
    >
      {withdrawPage.status[status]}
    </span>
  );
}
