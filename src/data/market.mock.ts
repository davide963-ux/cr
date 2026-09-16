/**
 * ⚠️ DATI DIMOSTRATIVI — non rappresentano quotazioni reali.
 * Utilizzati solo dal mockProvider. Sostituiti automaticamente
 * quando MARKET_DATA_PROVIDER punta a un provider reale.
 */
export interface MockQuote {
  priceUsd: number;
  change24hPct: number;
  marketCapUsd: number;
  volume24hUsd: number;
  high24hUsd: number;
  low24hUsd: number;
  /** Volatilità relativa usata per generare la serie mock. */
  volatility: number;
}

export const MOCK_UPDATED_AT = "2026-09-16T08:30:00.000Z";

export const mockQuotes: Record<string, MockQuote> = {
  bitcoin: {
    priceUsd: 104582.32,
    change24hPct: 2.84,
    marketCapUsd: 2_071_480_000_000,
    volume24hUsd: 38_420_000_000,
    high24hUsd: 105_210.4,
    low24hUsd: 101_386.75,
    volatility: 0.006,
  },
  ethereum: {
    priceUsd: 3912.45,
    change24hPct: 1.92,
    marketCapUsd: 471_300_000_000,
    volume24hUsd: 19_850_000_000,
    high24hUsd: 3948.1,
    low24hUsd: 3821.6,
    volatility: 0.008,
  },
  solana: {
    priceUsd: 172.36,
    change24hPct: -1.24,
    marketCapUsd: 81_900_000_000,
    volume24hUsd: 3_640_000_000,
    high24hUsd: 176.92,
    low24hUsd: 170.08,
    volatility: 0.011,
  },
  binancecoin: {
    priceUsd: 684.1,
    change24hPct: 0.67,
    marketCapUsd: 99_700_000_000,
    volume24hUsd: 1_920_000_000,
    high24hUsd: 689.4,
    low24hUsd: 676.25,
    volatility: 0.005,
  },
  ripple: {
    priceUsd: 2.41,
    change24hPct: -0.85,
    marketCapUsd: 139_600_000_000,
    volume24hUsd: 4_210_000_000,
    high24hUsd: 2.46,
    low24hUsd: 2.37,
    volatility: 0.009,
  },
  cardano: {
    priceUsd: 0.782,
    change24hPct: 3.12,
    marketCapUsd: 27_900_000_000,
    volume24hUsd: 910_000_000,
    high24hUsd: 0.7934,
    low24hUsd: 0.7511,
    volatility: 0.012,
  },
};
