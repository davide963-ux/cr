import { ChangeBadge } from "@/components/ui/ChangeBadge";
import { CoinMark } from "@/components/ui/CoinMark";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { getAssetDefinition } from "@/data/assets";
import { formatCompactCurrency, formatDateTime, formatPrice, splitPrice } from "@/lib/format";
import type { MarketAsset } from "@/services/market/types";
import { PriceChart } from "./PriceChart";

interface BitcoinCardProps {
  asset: MarketAsset;
  isDemo: boolean;
}

/** Scheda di mercato in evidenza. Presentazionale: riceve i dati già normalizzati. */
export function BitcoinCard({ asset, isDemo }: BitcoinCardProps) {
  const def = getAssetDefinition(asset.id);
  const { main, fraction } = splitPrice(asset.priceUsd);
  const positive = asset.change24hPct >= 0;

  const stats = [
    { label: "Capitalizzazione", value: formatCompactCurrency(asset.marketCapUsd) },
    { label: "Volume 24h", value: formatCompactCurrency(asset.volume24hUsd) },
    { label: "Massimo 24h", value: asset.high24hUsd === null ? "—" : formatPrice(asset.high24hUsd) },
    { label: "Minimo 24h", value: asset.low24hUsd === null ? "—" : formatPrice(asset.low24hUsd) },
  ];

  return (
    <article aria-labelledby="featured-asset-title" className="panel overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3.5">
          <CoinMark symbol={asset.symbol} tint={def?.tint ?? "#67e3ae"} size={44} />
          <div>
            <h2 id="featured-asset-title" className="font-wide text-lg font-semibold leading-tight text-paper">
              {asset.name}
            </h2>
            <p className="text-sm text-mist">{asset.symbol} / USD</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-mist">
          {isDemo ? <DemoBadge /> : null}
          <span>
            Aggiornato <time dateTime={asset.updatedAt}>{formatDateTime(asset.updatedAt)}</time>
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col justify-between gap-10 p-6 sm:p-8 lg:border-r lg:border-line">
          <div>
            <p className="text-sm text-mist">Prezzo attuale</p>
            <p className="font-display tabular mt-2 text-[clamp(2.5rem,7vw,4.25rem)] leading-none text-paper">
              {main}
              <span className="text-mist">{fraction}</span>
            </p>
            <div className="mt-4 flex items-center gap-2.5 text-sm text-mist">
              <ChangeBadge value={asset.change24hPct} />
              <span>ultime 24 ore</span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {stats.map((s) => (
              <div key={s.label} className="bg-panel p-4">
                <dt className="text-xs text-mist">{s.label}</dt>
                <dd className="tabular mt-1 text-[0.9375rem] font-medium text-paper">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-line p-6 sm:p-8 lg:border-t-0">
          <PriceChart id={asset.id} points={asset.sparkline} positive={positive} assetName={asset.name} />
        </div>
      </div>
    </article>
  );
}
