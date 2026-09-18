"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { cn } from "@/lib/cn";
import { formatAmount, formatBtc } from "@/lib/format";
import { useRates } from "./RatesProvider";

interface TileProps {
  icon: IconName;
  label: string;
  value: ReactNode;
  footer: ReactNode;
  tint?: "mint" | "neutral";
}

function Tile({ icon, label, value, footer, tint = "neutral" }: TileProps) {
  return (
    <div className="panel p-5 transition-colors duration-200 hover:border-line-strong">
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[var(--radius-card)]",
            tint === "mint" ? "bg-mint/10 text-mint" : "bg-panel-raised text-mist",
          )}
        >
          <Icon name={icon} size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-mist">{label}</p>
          <p className="font-wide tabular mt-1.5 truncate text-2xl font-semibold text-paper">{value}</p>
        </div>
      </div>
      <div className="mt-4 border-t border-line pt-3 text-xs text-mist">{footer}</div>
    </div>
  );
}

/** Variazione con segno e colore. Il colore non è l'unico indicatore: c'è il segno. */
function Change({ amount, percent, currency }: { amount: number; percent: number | null; currency: string }) {
  const positive = amount >= 0;
  return (
    <span className={cn("tabular inline-flex items-center gap-1", positive ? "text-mint" : "text-loss")}>
      {positive ? "↑" : "↓"} {positive ? "+" : ""}
      {formatAmount(amount, currency)}
      {percent === null ? null : ` (${positive ? "+" : ""}${percent.toFixed(1)}%)`}
    </span>
  );
}

interface StatTilesProps {
  balance: number;
  currency: string;
  walletCount: number;
  weekly: { amount: number; percent: number | null } | null;
}

export function StatTiles({ balance, currency, walletCount, weekly }: StatTilesProps) {
  const rates = useRates();

  const btcValue =
    rates.status === "ready" ? (
      formatBtc(balance / rates.rates.eur)
    ) : (
      <span className="text-mist">—</span>
    );

  const btcFooter =
    rates.status === "ready"
      ? `1 BTC = ${formatAmount(rates.rates.eur, "EUR")}`
      : rates.status === "loading"
        ? dashboardHome.ratesLoading
        : dashboardHome.ratesUnavailable;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Tile
        icon="wallet"
        tint="mint"
        label={dashboardHome.balanceLabel}
        value={formatAmount(balance, currency)}
        footer={dashboardHome.balanceTileFooter}
      />
      <Tile
        icon="chart"
        label={dashboardHome.btcTileLabel}
        value={btcValue}
        footer={btcFooter}
      />
      <Tile
        icon="home"
        label={dashboardHome.walletsLabel}
        value={walletCount}
        footer={walletCount === 0 ? dashboardHome.walletsNone : dashboardHome.walletsActive}
      />
      <Tile
        icon="settle"
        label={dashboardHome.weeklyLabel}
        value={
          weekly ? (
            <Change amount={weekly.amount} percent={weekly.percent} currency={currency} />
          ) : (
            <span className="text-mist">—</span>
          )
        }
        footer={weekly ? dashboardHome.weeklyFooter : dashboardHome.weeklyNone}
      />
    </div>
  );
}
