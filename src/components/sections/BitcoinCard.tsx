import { CoinMark } from "@/components/ui/CoinMark";
import { CoinMarketCapCredit, CoinMarketCapWidget } from "@/components/ui/CoinMarketCapWidget";
import { FEATURED_ASSET } from "@/data/assets";

/** ID CoinMarketCap di Bitcoin. */
const CMC_BITCOIN_ID = "1";

/**
 * Scheda di mercato in evidenza. La cornice resta quella del sito (pannello,
 * monogramma, tipografia); prezzo, rank, capitalizzazione e volume arrivano in
 * tempo reale dal widget CoinMarketCap.
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
            <p className="text-sm text-mist">{FEATURED_ASSET.symbol} / EUR</p>
          </div>
        </div>
        <CoinMarketCapCredit />
      </header>

      <div className="p-6 sm:p-8">
        <CoinMarketCapWidget
          currencyId={CMC_BITCOIN_ID}
          base="EUR"
          className="overflow-hidden rounded-[var(--radius-card)] [&_iframe]:block [&_iframe]:w-full"
        />
      </div>
    </article>
  );
}
