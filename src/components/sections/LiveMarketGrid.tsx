"use client";

import { useLiveMarket } from "@/hooks/useLiveMarket";
import type { MarketSnapshot } from "@/services/market/types";
import { CryptoMarketGrid } from "./CryptoMarketGrid";

/** Idrata la griglia asset con i dati SSR, poi li mantiene aggiornati via polling. */
export function LiveMarketGrid({ initial }: { initial: MarketSnapshot }) {
  const { snapshot } = useLiveMarket(initial);
  return <CryptoMarketGrid assets={snapshot.assets} />;
}
