/**
 * Registro degli asset mostrati in homepage.
 * `providerId` è l'identificativo usato dal provider di mercato
 * (da allineare quando verrà scelto il fornitore reale).
 */
export interface AssetDefinition {
  providerId: string;
  symbol: string;
  name: string;
  /** Colore della monogramma (identità neutra, non il logo ufficiale). */
  tint: string;
}

export const FEATURED_ASSET_ID = "bitcoin";

export const assetRegistry: AssetDefinition[] = [
  { providerId: "bitcoin", symbol: "BTC", name: "Bitcoin", tint: "#E9A24B" },
  { providerId: "ethereum", symbol: "ETH", name: "Ethereum", tint: "#9AA8E8" },
  { providerId: "solana", symbol: "SOL", name: "Solana", tint: "#B58CF0" },
  { providerId: "binancecoin", symbol: "BNB", name: "BNB", tint: "#E8C24A" },
  { providerId: "ripple", symbol: "XRP", name: "XRP", tint: "#B9C4C9" },
  { providerId: "cardano", symbol: "ADA", name: "Cardano", tint: "#6FA3E8" },
];

export const HOMEPAGE_ASSET_IDS = assetRegistry.map((a) => a.providerId);

export function getAssetDefinition(providerId: string): AssetDefinition | undefined {
  return assetRegistry.find((a) => a.providerId === providerId);
}
