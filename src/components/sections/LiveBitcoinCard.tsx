"use client";

import { useLiveMarket } from "@/hooks/useLiveMarket";
import type { MarketSnapshot } from "@/services/market/types";
import { BitcoinCard } from "./BitcoinCard";

/** Idrata la scheda in evidenza con i dati SSR, poi li mantiene aggiornati via polling. */
export function LiveBitcoinCard({ initial }: { initial: MarketSnapshot }) {
  const { snapshot, isLive } = useLiveMarket(initial);
  return <BitcoinCard asset={snapshot.featured} isDemo={snapshot.isDemo} isLive={isLive} />;
}
