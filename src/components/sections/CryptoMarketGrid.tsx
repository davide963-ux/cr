import { CoinMark } from "@/components/ui/CoinMark";
import { TradingViewWidget } from "@/components/ui/TradingViewWidget";
import { assetRegistry } from "@/data/assets";

/**
 * "Quote board": su mobile carosello orizzontale con snap,
 * da sm in su griglia unica con divisori da 1px (gap-px su fondo bg-line).
 * Ogni scheda mostra un widget TradingView: prezzo, variazione e mini grafico
 * in tempo reale, aggiornati dal browser senza chiamate al nostro server.
 */
export function CryptoMarketGrid() {
  return (
    <div
      role="region"
      aria-label="Elenco asset, scorrevole orizzontalmente su schermi piccoli"
      tabIndex={0}
      className="scrollbar-none -mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0"
    >
      <ul
        className="flex snap-x snap-mandatory gap-3 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-[var(--radius-panel)] sm:border sm:border-line sm:bg-line lg:grid-cols-3"
      >
        {assetRegistry.map((asset) => (
          <li
            key={asset.providerId}
            className="relative w-[78%] shrink-0 snap-start rounded-[var(--radius-card)] border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-raised min-[480px]:w-[60%] sm:w-auto sm:rounded-none sm:border-0 sm:p-6"
          >
            <article aria-labelledby={`asset-${asset.providerId}`}>
              <div className="flex items-center gap-3">
                <CoinMark symbol={asset.symbol} tint={asset.tint} />
                <div className="min-w-0">
                  <h3
                    id={`asset-${asset.providerId}`}
                    className="truncate font-medium leading-tight text-paper"
                  >
                    {asset.name}
                  </h3>
                  <p className="text-sm text-mist">{asset.symbol}</p>
                </div>
              </div>

              <TradingViewWidget
                widget="mini-symbol-overview"
                className="mt-4 h-[140px] w-full"
                config={{
                  symbol: asset.tvSymbol,
                  chartOnly: false,
                  dateRange: "1D",
                  locale: "it",
                  colorTheme: "dark",
                  isTransparent: true,
                  autosize: true,
                  noTimeScale: true,
                  chartType: "area",
                  fontFamily: "inherit",
                }}
              />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
