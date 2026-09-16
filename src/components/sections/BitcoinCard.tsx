import { CoinMark } from "@/components/ui/CoinMark";
import { TradingViewCredit, TradingViewWidget } from "@/components/ui/TradingViewWidget";
import { FEATURED_ASSET } from "@/data/assets";

/**
 * Scheda di mercato in evidenza. La cornice resta quella del sito (pannello,
 * monogramma, tipografia); le quotazioni arrivano in tempo reale dallo screener
 * TradingView, che gira nel browser del visitatore.
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
            <p className="text-sm text-mist">{FEATURED_ASSET.symbol} / USD</p>
          </div>
        </div>
        <TradingViewCredit
          href="https://www.tradingview.com/markets/cryptocurrencies/prices-all/"
          label="Crypto markets by TradingView"
        />
      </header>

      <TradingViewWidget
        widget="screener"
        className="w-full p-2 sm:p-4"
        config={{
          defaultColumn: "overview",
          screener_type: "crypto_mkt",
          displayCurrency: "USD",
          colorTheme: "light",
          isTransparent: false,
          locale: "en",
          width: "100%",
          height: 550,
        }}
      />
    </article>
  );
}
