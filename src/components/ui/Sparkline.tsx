import { buildChartGeometry } from "@/lib/chart";
import { cn } from "@/lib/cn";
import type { PricePoint } from "@/services/market/types";

const W = 120;
const H = 40;

interface SparklineProps {
  /** Identificativo univoco (usato per il gradient SVG) */
  id: string;
  points: readonly PricePoint[];
  positive: boolean;
  className?: string;
  label: string;
}

/** Mini-grafico SVG puro: renderizzato sul server, zero JavaScript nel client. */
export function Sparkline({ id, points, positive, className, label }: SparklineProps) {
  const { line, area } = buildChartGeometry(points, W, H, 0.1);
  if (!line) return null;
  const color = positive ? "var(--color-mint)" : "var(--color-loss)";
  const gradId = `spark-${id}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("block h-10 w-full overflow-visible", className)}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
