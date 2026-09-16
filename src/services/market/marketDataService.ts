import "server-only";
import { cache } from "react";
import { FEATURED_ASSET_ID, HOMEPAGE_ASSET_IDS } from "@/data/assets";
import { coingeckoProvider } from "./providers/coingeckoProvider";
import { httpProvider } from "./providers/httpProvider";
import { mockProvider } from "./providers/mockProvider";
import type { MarketDataProvider, MarketResult } from "./types";

/**
 * Punto d'ingresso unico per i dati di mercato.
 * Selezione del provider tramite variabile d'ambiente (solo server):
 *   MARKET_DATA_PROVIDER=coingecko (default, quotazioni reali) | mock | http
 */
function resolveProvider(): MarketDataProvider {
  switch (process.env.MARKET_DATA_PROVIDER) {
    case "mock":
      return mockProvider;
    case "http":
      return httpProvider;
    case "coingecko":
    case undefined:
    case "":
      return coingeckoProvider;
    default:
      console.warn(`MARKET_DATA_PROVIDER sconosciuto: "${process.env.MARKET_DATA_PROVIDER}". Uso coingecko.`);
      return coingeckoProvider;
  }
}

/**
 * Snapshot della homepage. `cache` deduplica le chiamate nella stessa
 * richiesta: BitcoinCard e CryptoMarketGrid condividono un'unica fetch.
 */
export const getMarketSnapshot = cache(async (): Promise<MarketResult> => {
  const provider = resolveProvider();
  try {
    const assets = await provider.getAssets(HOMEPAGE_ASSET_IDS);
    const featured = assets.find((a) => a.id === FEATURED_ASSET_ID);
    if (!featured || assets.length === 0) {
      return { status: "error", message: "Dati di mercato non disponibili al momento." };
    }
    const updatedAt = assets.reduce((max, a) => (a.updatedAt > max ? a.updatedAt : max), assets[0]!.updatedAt);
    return {
      status: "ok",
      data: { featured, assets, isDemo: provider.isDemo, provider: provider.name, updatedAt },
    };
  } catch (error) {
    // Il dettaglio resta nei log del server, all'utente un messaggio neutro
    console.error("[marketDataService]", error);
    return { status: "error", message: "Dati di mercato non disponibili al momento." };
  }
});
