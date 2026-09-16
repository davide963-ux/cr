import { getAssetDefinition } from "@/data/assets";
import { MOCK_UPDATED_AT, mockQuotes, type MockQuote } from "@/data/market.mock";
import { createSeededRandom, seedFromString } from "@/lib/seeded-random";
import type { MarketAsset, MarketDataProvider, PricePoint } from "../types";

const POINTS = 48; // un punto ogni 30 minuti su 24h
const STEP_MS = 30 * 60 * 1000;

/**
 * Genera una serie deterministica coerente con la quotazione:
 * parte da price / (1 + change) e termina esattamente sul prezzo attuale,
 * restando entro i limiti high/low.
 */
function buildSeries(id: string, q: MockQuote, endTime: number): PricePoint[] {
  const rand = createSeededRandom(seedFromString(id));
  const start = q.priceUsd / (1 + q.change24hPct / 100);
  const raw: number[] = [];
  let noise = 0;
  for (let i = 0; i < POINTS; i++) {
    const progress = i / (POINTS - 1);
    noise = noise * 0.72 + (rand() - 0.5) * q.volatility * 2;
    const drift = start + (q.priceUsd - start) * progress;
    // il rumore si annulla agli estremi per rispettare apertura e chiusura
    const envelope = Math.sin(Math.PI * progress);
    raw.push(drift * (1 + noise * envelope));
  }
  raw[POINTS - 1] = q.priceUsd;
  return raw.map((price, i) => ({
    t: endTime - (POINTS - 1 - i) * STEP_MS,
    price: Math.min(q.high24hUsd, Math.max(q.low24hUsd, price)),
  }));
}

export const mockProvider: MarketDataProvider = {
  name: "mock",
  isDemo: true,

  async getAssets(ids) {
    const endTime = Date.parse(MOCK_UPDATED_AT);
    return ids.map((id): MarketAsset => {
      const def = getAssetDefinition(id);
      const q = mockQuotes[id];
      if (!def || !q) throw new Error(`Asset mock non configurato: ${id}`);
      return {
        id,
        symbol: def.symbol,
        name: def.name,
        priceUsd: q.priceUsd,
        change24hPct: q.change24hPct,
        marketCapUsd: q.marketCapUsd,
        volume24hUsd: q.volume24hUsd,
        high24hUsd: q.high24hUsd,
        low24hUsd: q.low24hUsd,
        sparkline: buildSeries(id, q, endTime),
        updatedAt: MOCK_UPDATED_AT,
      };
    });
  },
};
