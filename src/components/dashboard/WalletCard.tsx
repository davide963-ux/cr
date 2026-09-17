import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";
import type { AccountUser } from "@/services/account/types";
import { Card } from "./Card";

interface WalletCardProps {
  account: AccountUser;
  title: string;
  addressLabel: string;
  emptyLabel: string;
  action: React.ReactNode;
  /** Testo sotto al pulsante, quando la funzione è ancora in preparazione. */
  note?: string;
}

/**
 * Indirizzo wallet. Finché non è configurato resta uno spazio dichiarato vuoto:
 * un indirizzo inventato qui sarebbe indistinguibile da uno vero.
 */
export function WalletCard({ account, title, addressLabel, emptyLabel, action, note }: WalletCardProps) {
  const address = account.walletAddress;

  return (
    <Card title={title}>
      <p className="text-sm text-mist">{addressLabel}</p>
      <div
        className={cn(
          "mt-2 flex items-center gap-3 rounded-[var(--radius-card)] border px-4 py-3.5",
          address ? "border-line bg-panel-raised" : "border-dashed border-line",
        )}
      >
        <Icon name="wallet" size={18} className="shrink-0 text-mist/70" />
        <span className={cn("tabular break-all text-[0.9375rem]", address ? "text-paper" : "text-mist")}>
          {address ?? emptyLabel}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">{action}</div>
      {note ? <p className="mt-4 text-xs text-mist">{note}</p> : null}
    </Card>
  );
}
