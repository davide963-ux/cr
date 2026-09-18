"use client";

import { satsToBtc, satsToCurrency } from "@/lib/money";
import { formatAmount, formatBtc } from "@/lib/format";
import { withdrawPage } from "@/data/content";
import { Shimmer } from "./Shimmer";
import { useRates } from "./RatesProvider";

/**
 * Il controvalore in euro di una quantità di satoshi.
 *
 * Non può essere reso dal server: dipende dal cambio corrente, che arriva dal
 * browser. Finché il cambio non c'è mostra una barra, non uno zero — una
 * cifra inventata su un saldo è peggio di nessuna cifra.
 */
export function Money({
  sats,
  currency = "EUR",
  className,
  signed = false,
}: {
  sats: number;
  currency?: string;
  className?: string;
  /** Antepone il segno: serve nei movimenti, dove il verso è l'informazione. */
  signed?: boolean;
}) {
  const rates = useRates();

  if (rates.status === "ready") {
    const value = satsToCurrency(sats, rates.rates.eur);
    const prefix = signed && sats > 0 ? "+" : "";
    return <span className={className}>{prefix + formatAmount(value, currency)}</span>;
  }
  if (rates.status === "loading") {
    return <Shimmer label={withdrawPage.loadingValue} className="h-[1em] w-24 align-middle" />;
  }
  return <span className="text-mist">—</span>;
}

/** La quantità in bitcoin: questa sì che è un dato conservato, non calcolato. */
export function Btc({ sats, className }: { sats: number; className?: string }) {
  return <span className={className}>{formatBtc(satsToBtc(sats))}</span>;
}
