import { ChangeBadge } from "@/components/ui/ChangeBadge";
import { CoinMark } from "@/components/ui/CoinMark";
import { Sparkline } from "@/components/ui/Sparkline";
import { getAssetDefinition } from "@/data/assets";
import { formatCompactCurrency, formatPrice } from "@/lib/format";
import type { MarketAsset } from "@/services/market/types";

/**
 * "Quote board": su mobile carosello orizzontale con snap,
 * da sm in su griglia unica con divisori da 1px (gap-px su fondo bg-line).
 */
export function CryptoMarketGrid({ assets }: { assets: MarketAsset[] }) {
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
        {assets.map((asset) => {
          const def = getAssetDefinition(asset.id);
          const positive = asset.change24hPct >= 0;
          return (
            <li
              key={asset.id}
              className="relative w-[78%] shrink-0 snap-start rounded-[var(--radius-card)] border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-raised min-[480px]:w-[60%] sm:w-auto sm:rounded-none sm:border-0 sm:p-6"
            >
              <article aria-labelledby={`asset-${asset.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CoinMark symbol={asset.symbol} tint={def?.tint ?? "#67e3ae"} />
                    <div className="min-w-0">
                      <h3 id={`asset-${asset.id}`} className="truncate font-medium leading-tight text-paper">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-mist">{asset.symbol}</p>
                    </div>
                  </div>
                  <ChangeBadge value={asset.change24hPct} />
                </div>

                <p className="font-wide tabular mt-6 text-2xl font-medium tracking-tight text-paper">
                  {formatPrice(asset.priceUsd)}
                </p>

                <Sparkline
                  id={asset.id}
                  points={asset.sparkline}
                  positive={positive}
                  className="mt-4"
                  label={`Andamento di ${asset.name} nelle ultime 24 ore`}
                />

                <p className="mt-4 flex justify-between border-t border-line pt-3 text-xs text-mist">
                  <span>Volume 24h</span>
                  <span className="tabular text-paper/80">{formatCompactCurrency(asset.volume24hUsd)}</span>
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
