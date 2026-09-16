import { buildChartGeometry } from "@/lib/chart";
import { formatPrice } from "@/lib/format";
import type { PricePoint } from "@/services/market/types";

const W = 600;
const H = 240;
const GRID_LEVELS = 4;
const X_LABELS = ["−24h", "−18h", "−12h", "−6h", "Ora"];

interface PriceChartProps {
  id: string;
  points: readonly PricePoint[];
  positive: boolean;
  assetName: string;
}

/**
 * Grafico prezzi 24h. Il tracciato SVG si adatta al contenitore
 * (preserveAspectRatio="none" + stroke non scalato); etichette e marker
 * sono HTML posizionato in percentuale, quindi non si deformano.
 */
export function PriceChart({ id, points, positive, assetName }: PriceChartProps) {
  const geo = buildChartGeometry(points, W, H, 0.1);
  if (!geo.line) return null;

  const color = positive ? "var(--color-mint)" : "var(--color-loss)";
  const levels = Array.from({ length: GRID_LEVELS }, (_, i) => {
    const ratio = i / (GRID_LEVELS - 1);
    // stessa scala di buildChartGeometry (padY = 0.1)
    const yPct = 10 + ratio * 80;
    return { yPct, value: geo.max - ratio * (geo.max - geo.min) };
  });

  return (
    <figure className="flex h-full flex-col">
      <div
        className="relative min-h-52 flex-1 sm:min-h-64"
        role="img"
        aria-label={`Andamento del prezzo di ${assetName} nelle ultime 24 ore: minimo ${formatPrice(geo.min)}, massimo ${formatPrice(geo.max)}.`}
      >
        {levels.map((l) => (
          <div key={l.yPct} className="absolute inset-x-0 flex items-center" style={{ top: `${l.yPct}%` }} aria-hidden="true">
            <div className="h-px flex-1 border-t border-dashed border-line" />
            <span className="tabular -translate-y-1/2 pl-3 text-[0.6875rem] text-mist/80">{formatPrice(l.value)}</span>
          </div>
        ))}

        <div className="absolute inset-y-0 left-0 right-[5.5rem]" aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id={`area-${id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={geo.area} fill={`url(#area-${id})`} />
            <path
              d={geo.line}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray="1"
              className="animate-draw"
            />
          </svg>
          {geo.last ? (
            <span
              className={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ${
                positive ? "bg-mint ring-mint/20" : "bg-loss ring-loss/20"
              }`}
              style={{ left: `${geo.last.xPct}%`, top: `${geo.last.yPct}%` }}
            />
          ) : null}
        </div>
      </div>

      <figcaption className="sr-only">Grafico a linee del prezzo nelle ultime 24 ore</figcaption>
      <div className="mr-[5.5rem] mt-3 flex justify-between text-[0.6875rem] text-mist/80" aria-hidden="true">
        {X_LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </figure>
  );
}
