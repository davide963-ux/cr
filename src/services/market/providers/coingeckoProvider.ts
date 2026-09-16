import "server-only";
import { getAssetDefinition } from "@/data/assets";
import { toFiniteOrNull } from "@/lib/sanitize";
import type { MarketAsset, MarketDataProvider, PricePoint } from "../types";

/**
 * Provider di mercato reale: CoinGecko `/coins/markets` (piano gratuito).
 * Nessuna chiave è obbligatoria; se impostata, `COINGECKO_API_KEY` viene
 * inviata come header (piano Demo) per un rate limit più alto.
 */
const API_BASE = "https://api.coingecko.com/api/v3";
const SPARKLINE_HOURS = 24;
const HOUR_MS = 60 * 60 * 1000;

function config() {
  const apiKey = process.env.COINGECKO_API_KEY;
  const revalidate = Number(process.env.MARKET_DATA_REVALIDATE_SECONDS ?? 30);
  return { apiKey, revalidate: Number.isFinite(revalidate) ? revalidate : 30 };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Le ultime 24h della serie a 7 giorni fornita da CoinGecko, riallineate sul prezzo attuale. */
function normalizeSparkline(raw: unknown, currentPrice: number, endTime: number): PricePoint[] {
  const prices = isRecord(raw) && Array.isArray(raw.price)
    ? raw.price.map(toFiniteOrNull).filter((p): p is number => p !== null)
    : [];
  const slice = prices.slice(-SPARKLINE_HOURS);
  if (slice.length === 0) return [];
  slice[slice.length - 1] = currentPrice;
  return slice.map((price, i) => ({
    t: endTime - (slice.length - 1 - i) * HOUR_MS,
    price,
  }));
}

/** Valida e normalizza una riga della risposta: mai fidarsi della forma dei dati esterni. */
function normalizeAsset(raw: unknown, endTime: number): MarketAsset | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" ? raw.id : "";
  const def = getAssetDefinition(id);
  const price = toFiniteOrNull(raw.current_price);
  const change = toFiniteOrNull(raw.price_change_percentage_24h);
  if (!def || price === null || change === null) return null;

  const updated = typeof raw.last_updated === "string" && !Number.isNaN(Date.parse(raw.last_updated))
    ? new Date(raw.last_updated).toISOString()
    : new Date(endTime).toISOString();

  return {
    id,
    symbol: def.symbol,
    name: def.name,
    priceUsd: price,
    change24hPct: change,
    marketCapUsd: toFiniteOrNull(raw.market_cap),
    volume24hUsd: toFiniteOrNull(raw.total_volume),
    high24hUsd: toFiniteOrNull(raw.high_24h),
    low24hUsd: toFiniteOrNull(raw.low_24h),
    sparkline: normalizeSparkline(raw.sparkline_in_7d, price, endTime),
    updatedAt: updated,
  };
}

export const coingeckoProvider: MarketDataProvider = {
  name: "coingecko",
  isDemo: false,

  async getAssets(ids) {
    const { apiKey, revalidate } = config();
    const url = new URL("/coins/markets", API_BASE);
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", ids.join(","));
    url.searchParams.set("price_change_percentage", "24h");
    url.searchParams.set("sparkline", "true");

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { "x-cg-demo-api-key": apiKey } : {}),
      },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`CoinGecko: HTTP ${res.status}`);

    const body: unknown = await res.json();
    const endTime = Date.now();
    const byId = new Map(
      (Array.isArray(body) ? body : [])
        .map((row) => normalizeAsset(row, endTime))
        .filter((a): a is MarketAsset => a !== null)
        .map((a) => [a.id, a]),
    );

    // Mantiene l'ordine richiesto e scarta gli asset mancanti
    return ids.map((id) => byId.get(id)).filter((a): a is MarketAsset => a !== undefined);
  },
};
