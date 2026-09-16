import "server-only";
import { getAssetDefinition } from "@/data/assets";
import { sanitizeText, toFiniteOrNull } from "@/lib/sanitize";
import type { MarketAsset, MarketDataProvider, PricePoint } from "../types";

/**
 * TEMPLATE per un provider REST reale.
 * Gira solo sul server: la chiave API non raggiunge mai il browser.
 *
 * Formato atteso (adattare `normalizeAsset` al fornitore scelto):
 *   GET {MARKET_DATA_API_URL}/assets?ids=bitcoin,ethereum
 *   → { data: [{ id, price, change24h, marketCap, volume24h, high24h, low24h,
 *                sparkline: [[timestampMs, price], …], updatedAt }] }
 */
function config() {
  const baseUrl = process.env.MARKET_DATA_API_URL;
  const apiKey = process.env.MARKET_DATA_API_KEY;
  const revalidate = Number(process.env.MARKET_DATA_REVALIDATE_SECONDS ?? 30);
  if (!baseUrl) throw new Error("MARKET_DATA_API_URL non configurato");
  return { baseUrl, apiKey, revalidate: Number.isFinite(revalidate) ? revalidate : 30 };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function normalizeSparkline(input: unknown): PricePoint[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row): PricePoint | null => {
      if (!Array.isArray(row)) return null;
      const t = toFiniteOrNull(row[0]);
      const price = toFiniteOrNull(row[1]);
      return t !== null && price !== null ? { t, price } : null;
    })
    .filter((p): p is PricePoint => p !== null)
    .sort((a, b) => a.t - b.t);
}

/** Valida e normalizza la risposta: mai fidarsi della forma dei dati esterni. */
function normalizeAsset(raw: unknown): MarketAsset | null {
  if (!isRecord(raw)) return null;
  const id = sanitizeText(raw.id, 64);
  const price = toFiniteOrNull(raw.price);
  const change = toFiniteOrNull(raw.change24h);
  const def = getAssetDefinition(id);
  if (!def || price === null || change === null) return null;

  const updated = typeof raw.updatedAt === "string" && !Number.isNaN(Date.parse(raw.updatedAt))
    ? new Date(raw.updatedAt).toISOString()
    : new Date().toISOString();

  return {
    id,
    symbol: def.symbol,
    name: def.name,
    priceUsd: price,
    change24hPct: change,
    marketCapUsd: toFiniteOrNull(raw.marketCap),
    volume24hUsd: toFiniteOrNull(raw.volume24h),
    high24hUsd: toFiniteOrNull(raw.high24h),
    low24hUsd: toFiniteOrNull(raw.low24h),
    sparkline: normalizeSparkline(raw.sparkline),
    updatedAt: updated,
  };
}

export const httpProvider: MarketDataProvider = {
  name: "http",
  isDemo: false,

  async getAssets(ids) {
    const { baseUrl, apiKey, revalidate } = config();
    const url = new URL("/assets", baseUrl);
    url.searchParams.set("ids", ids.join(","));

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Provider di mercato: HTTP ${res.status}`);

    const body: unknown = await res.json();
    const list = isRecord(body) && Array.isArray(body.data) ? body.data : [];
    const byId = new Map(
      list.map(normalizeAsset).filter((a): a is MarketAsset => a !== null).map((a) => [a.id, a]),
    );

    // Mantiene l'ordine richiesto e scarta gli asset mancanti
    return ids.map((id) => byId.get(id)).filter((a): a is MarketAsset => a !== undefined);
  },
};
