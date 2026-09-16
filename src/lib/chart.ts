import type { PricePoint } from "@/services/market/types";

export interface ChartGeometry {
  line: string;
  area: string;
  min: number;
  max: number;
  /** Ultimo punto in percentuale del box (per marker HTML non deformati) */
  last: { xPct: number; yPct: number } | null;
}

/**
 * Converte una serie di prezzi in path SVG per un viewBox width×height.
 * `padY` lascia margine verticale (in frazione dell'altezza).
 */
export function buildChartGeometry(
  points: readonly PricePoint[],
  width: number,
  height: number,
  padY = 0.08,
): ChartGeometry {
  if (points.length < 2) return { line: "", area: "", min: 0, max: 0, last: null };

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const t0 = points[0]!.t;
  const tSpan = points[points.length - 1]!.t - t0 || 1;
  const innerH = height * (1 - padY * 2);

  const coords = points.map((p) => {
    const x = ((p.t - t0) / tSpan) * width;
    const y = height * padY + (1 - (p.price - min) / range) * innerH;
    return [x, y] as const;
  });

  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const [lx, ly] = coords[coords.length - 1]!;

  return { line, area, min, max, last: { xPct: (lx / width) * 100, yPct: (ly / height) * 100 } };
}
