"use client";

import { Icon } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { formatAmount, formatBtc } from "@/lib/format";
import { useRates } from "./RatesProvider";

/** Riepilogo del saldo in cima alla barra laterale, in bitcoin e in valuta. */
export function SidebarBalance({ balance, currency }: { balance: number; currency: string }) {
  const rates = useRates();
  const btc = rates.status === "ready" ? balance / rates.rates.eur : null;

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-mist">
          {dashboardHome.sidebarBalanceLabel}
        </p>
        <Icon name="wallet" size={14} className="shrink-0 text-mist" />
      </div>
      <p className="font-wide tabular mt-2.5 text-xl font-semibold text-mint">
        {btc === null ? "—" : formatBtc(btc)}
      </p>
      <p className="tabular mt-1 text-sm text-mist">{formatAmount(balance, currency)}</p>
    </div>
  );
}
