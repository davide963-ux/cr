"use client";

import { Icon } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { Money, Btc } from "./Money";

/** Riepilogo del saldo in cima alla barra laterale, in bitcoin e in valuta. */
export function SidebarBalance({ balanceSats, currency }: { balanceSats: number; currency: string }) {

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
      {/* La quantità in bitcoin viene prima: è il saldo vero, non una stima. */}
      <Btc sats={balanceSats} className="font-wide tabular glow-mint mt-2.5 block text-xl font-semibold" />
      <Money sats={balanceSats} currency={currency} className="tabular mt-1 block text-sm text-mist" />
    </div>
  );
}
