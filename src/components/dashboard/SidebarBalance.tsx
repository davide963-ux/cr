"use client";

import { Icon } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { formatAmount, formatBtc } from "@/lib/format";
import { useRates } from "./RatesProvider";
import { Shimmer } from "./Shimmer";

/** Riepilogo del saldo in cima alla barra laterale, in bitcoin e in valuta. */
export function SidebarBalance({ balance, currency }: { balance: number; currency: string }) {
  const rates = useRates();
  const btc = rates.status === "ready" ? balance / rates.rates.eur : null;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
      {/* Velo di luce nell'angolo alto, per staccare il riquadro dal fondo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-mint/10 blur-2xl"
      />
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-mist">
          {dashboardHome.sidebarBalanceLabel}
        </p>
        <Icon name="wallet" size={14} className="shrink-0 text-mist" />
      </div>
      <p className="font-wide tabular glow-mint mt-2.5 text-xl font-semibold">
        {btc !== null ? (
          formatBtc(btc)
        ) : rates.status === "loading" ? (
          <Shimmer label={dashboardHome.ratesLoading} className="h-6 w-32 align-middle" />
        ) : (
          "—"
        )}
      </p>
      <p className="tabular mt-1 text-sm text-mist">{formatAmount(balance, currency)}</p>
    </div>
  );
}
