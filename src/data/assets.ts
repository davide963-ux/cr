/**
 * Registro degli asset mostrati in homepage.
 * I prezzi arrivano dai widget: qui stanno solo identità e simboli.
 */
export interface AssetDefinition {
  /** Identificativo interno, usato anche come chiave di React. */
  providerId: string;
  symbol: string;
  name: string;
  /** Colore della monogramma (identità neutra, non il logo ufficiale). */
  tint: string;
  /** Simbolo usato dai widget TradingView che mostrano le quotazioni. */
  tvSymbol: string;
}

export const FEATURED_ASSET_ID = "bitcoin";

export const assetRegistry: AssetDefinition[] = [
  { providerId: "bitcoin", symbol: "BTC", name: "Bitcoin", tint: "#E9A24B", tvSymbol: "BINANCE:BTCEUR" },
  { providerId: "ethereum", symbol: "ETH", name: "Ethereum", tint: "#9AA8E8", tvSymbol: "BINANCE:ETHEUR" },
  { providerId: "solana", symbol: "SOL", name: "Solana", tint: "#B58CF0", tvSymbol: "BINANCE:SOLEUR" },
  { providerId: "binancecoin", symbol: "BNB", name: "BNB", tint: "#E8C24A", tvSymbol: "BINANCE:BNBEUR" },
  { providerId: "ripple", symbol: "XRP", name: "XRP", tint: "#B9C4C9", tvSymbol: "BINANCE:XRPEUR" },
  { providerId: "cardano", symbol: "ADA", name: "Cardano", tint: "#6FA3E8", tvSymbol: "BINANCE:ADAEUR" },
];

export const FEATURED_ASSET = assetRegistry.find((a) => a.providerId === FEATURED_ASSET_ID)!;


