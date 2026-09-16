/**
 * Reti supportate. Per aggiungere una chain basta aggiungere un elemento:
 * il diagramma della sezione Multichain si ridistribuisce automaticamente.
 */
export interface ChainDefinition {
  id: string;
  name: string;
  /** Sigla mostrata nel nodo. */
  mark: string;
  kind: "Layer 1" | "Layer 2" | "Sidechain";
  vm: "EVM" | "SVM";
  tint: string;
}

export const chains: ChainDefinition[] = [
  { id: "ethereum", name: "Ethereum", mark: "ET", kind: "Layer 1", vm: "EVM", tint: "#9AA8E8" },
  { id: "solana", name: "Solana", mark: "SO", kind: "Layer 1", vm: "SVM", tint: "#B58CF0" },
  { id: "bnb-chain", name: "BNB Chain", mark: "BN", kind: "Layer 1", vm: "EVM", tint: "#E8C24A" },
  { id: "polygon", name: "Polygon", mark: "PO", kind: "Sidechain", vm: "EVM", tint: "#A68BEA" },
  { id: "arbitrum", name: "Arbitrum", mark: "AR", kind: "Layer 2", vm: "EVM", tint: "#7DB2E8" },
  { id: "base", name: "Base", mark: "BA", kind: "Layer 2", vm: "EVM", tint: "#6C94F0" },
];
