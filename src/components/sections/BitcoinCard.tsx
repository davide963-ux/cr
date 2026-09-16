import { CoinMark } from "@/components/ui/CoinMark";
import { TradingViewCredit, TradingViewWidget } from "@/components/ui/TradingViewWidget";
import { FEATURED_ASSET } from "@/data/assets";

/**
 * Scheda di mercato in evidenza. La cornice resta quella del sito (pannello,
 * monogramma, tipografia); prezzo, variazione e grafico arrivano in tempo reale
 * dal widget TradingView, che gira nel browser del visitatore.
 */
export function BitcoinCard() {
  return (
    <article aria-labelledby="featured-asset-title" className="panel overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3.5">
          <CoinMark symbol={FEATURED_ASSET.symbol} tint={FEATURED_ASSET.tint} size={44} />
          <div>
            <h2 id="featured-asset-title" className="font-wide text-lg font-semibold leading-tight text-paper">
              {FEATURED_ASSET.name}
            </h2>
            <p className="text-sm text-mist">{FEATURED_ASSET.symbol} / USDT</p>
          </div>
        </div>
        <TradingViewCredit />
      </header>

      <TradingViewWidget
        widget="symbol-overview"
        className="h-[380px] w-full p-2 sm:h-[440px] sm:p-4"
        config={{
          symbols: [[FEATURED_ASSET.name, `${FEATURED_ASSET.tvSymbol}|1D`]],
          chartOnly: false,
          locale: "it",
          colorTheme: "dark",
          isTransparent: true,
          autosize: true,
          showVolume: false,
          showMA: false,
          hideDateRanges: false,
          hideMarketStatus: false,
          hideSymbolLogo: false,
          scalePosition: "right",
          scaleMode: "Normal",
          fontFamily: "inherit",
          fontSize: "12",
          chartType: "area",
          lineWidth: 2,
          gridLineColor: "rgba(255, 255, 255, 0.06)",
        }}
      />
    </article>
  );
}
