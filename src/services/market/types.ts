/**
 * Contratto dei dati di mercato. La UI dipende SOLO da questi tipi,
 * mai dal provider concreto (mock, API REST, WebSocket…).
 */
export interface PricePoint {
  /** Timestamp Unix in millisecondi */
  t: number;
  price: number;
}

export interface OhlcCandle {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  /** Variazione 24h in punti percentuali (2.84 = +2,84%) */
  change24hPct: number;
  marketCapUsd: number | null;
  volume24hUsd: number | null;
  high24hUsd: number | null;
  low24hUsd: number | null;
  /** Serie di prezzi delle ultime 24h, ordinata per tempo crescente */
  sparkline: PricePoint[];
  /** ISO 8601 */
  updatedAt: string;
}

export type HistoryRange = "24h" | "7d" | "30d" | "1y";

export interface MarketDataProvider {
  readonly name: string;
  /** true se i dati non sono quotazioni reali */
  readonly isDemo: boolean;
  getAssets(ids: readonly string[]): Promise<MarketAsset[]>;
  getOhlc?(id: string, range: HistoryRange): Promise<OhlcCandle[]>;
  getHistoricalPrices?(id: string, range: HistoryRange): Promise<PricePoint[]>;
}

export interface MarketSnapshot {
  featured: MarketAsset;
  assets: MarketAsset[];
  isDemo: boolean;
  provider: string;
  updatedAt: string;
}

/** Risultato esplicito: la UI mostra uno stato d'errore invece di rompersi. */
export type MarketResult =
  | { status: "ok"; data: MarketSnapshot }
  | { status: "error"; message: string };
