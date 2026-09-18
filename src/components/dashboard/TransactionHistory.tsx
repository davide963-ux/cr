import { Icon } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/format";
import type { LedgerEntry } from "@/services/account/types";
import { EmptyState } from "./Card";

/**
 * Cronologia dei movimenti, presa dal registro.
 * Non essendoci ancora pagamenti, per la maggior parte dei conti è vuota:
 * lo dice, invece di riempire lo spazio con transazioni inventate.
 */
export function TransactionHistory({ entries, currency }: { entries: LedgerEntry[]; currency: string }) {
  return (
    <section className="panel overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5">
        <div className="flex items-center gap-3.5">
          <span className="icon-tile grid size-10 shrink-0 place-items-center rounded-[var(--radius-card)]">
            <Icon name="document" size={19} />
          </span>
          <div>
            <h2 className="font-wide font-semibold leading-tight text-paper">{dashboardHome.historyTitle}</h2>
            <p className="text-sm text-mist">{dashboardHome.historySubtitle}</p>
          </div>
        </div>
        {entries.length > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-mint">
            <span aria-hidden="true" className="motion-safe:animate-halo size-1.5 rounded-full bg-mint" />
            {dashboardHome.historyLive}
          </span>
        ) : null}
      </header>

      <div className="p-6">
        {entries.length === 0 ? (
          <EmptyState message={dashboardHome.historyEmpty} icon="document" />
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => {
              const positive = entry.amount >= 0;
              return (
                <li
                  key={entry.id}
                  data-row=""
                  className="flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] border border-line bg-panel-raised p-4"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full ring-1",
                      positive
                        ? "bg-mint/10 text-mint ring-mint/20"
                        : "bg-loss/10 text-loss ring-loss/20",
                    )}
                    aria-hidden="true"
                  >
                    {positive ? "↓" : "↑"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] text-paper">{entry.reason}</p>
                    <p className="tabular mt-0.5 text-xs text-mist">
                      {new Date(entry.createdAt).toLocaleString("it-IT")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={cn("tabular font-medium", positive ? "text-mint" : "text-loss")}>
                      {positive ? "+" : ""}
                      {formatAmount(entry.amount, currency)}
                    </p>
                    <p className="tabular mt-0.5 text-xs text-mist">
                      {formatAmount(entry.balanceAfter, currency)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
