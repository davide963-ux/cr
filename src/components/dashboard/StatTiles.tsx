"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { dashboardHome } from "@/data/content";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/format";
import { satsToCurrency } from "@/lib/money";
import { Money, Btc } from "./Money";
import { useRates } from "./RatesProvider";
import { Shimmer } from "./Shimmer";

interface TileProps {
  icon: IconName;
  label: string;
  value: ReactNode;
  footer: ReactNode;
  tint?: "mint" | "neutral";
}

function Tile({ icon, label, value, footer, tint = "neutral" }: TileProps) {
  return (
    <div className="panel group p-5">
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-[var(--radius-card)] transition-transform duration-300 ease-[var(--ease-ui)] group-hover:scale-105",
            tint === "mint" ? "icon-tile" : "bg-panel-raised text-mist ring-1 ring-line",
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
  balanceSats: number;
  currency: string;
  walletCount: number;
}

export function StatTiles({ balanceSats, currency, walletCount }: StatTilesProps) {
  const rates = useRates();

  const btcFooter =
    rates.status === "ready"
      ? `1 BTC = ${formatAmount(rates.rates.eur, "EUR")}`
      : rates.status === "loading"
        ? dashboardHome.ratesLoading
        : dashboardHome.ratesUnavailable;

  /*
   * Quanto del saldo attuale è dovuto al movimento del prezzo negli ultimi
   * sette giorni. Non somma depositi e prelievi — quelli si leggono nella
   * cronologia: risponde alla domanda "perché ieri avevo una cifra diversa
   * senza aver fatto nulla", che prima non aveva risposta da nessuna parte.
   */
  const priceEffect =
    rates.status === "ready" && rates.rates.change7d !== null
      ? (() => {
          const now = satsToCurrency(balanceSats, rates.rates.eur);
          const before = now / (1 + rates.rates.change7d / 100);
          return { amount: now - before, percent: rates.rates.change7d };
        })()
      : null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Tile
        icon="wallet"
        tint="mint"
        label={dashboardHome.balanceLabel}
        value={<Money sats={balanceSats} currency={currency} className="glow-mint" />}
        footer={dashboardHome.balanceFollowsBtc}
      />
      <Tile
        icon="chart"
        label={dashboardHome.btcTileLabel}
        // La quantità in bitcoin è il dato conservato: c'è sempre, cambio o no.
        value={<Btc sats={balanceSats} />}
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
        label={dashboardHome.weeklyPriceLabel}
        value={
          priceEffect ? (
            <Change amount={priceEffect.amount} percent={priceEffect.percent} currency={currency} />
          ) : rates.status === "loading" ? (
            <Shimmer label={dashboardHome.ratesLoading} className="h-7 w-40 align-middle" />
          ) : (
            <span className="text-mist">—</span>
          )
        }
        footer={priceEffect ? dashboardHome.weeklyPriceFooter : dashboardHome.weeklyPriceNone}
      />
    </div>
  );
}
