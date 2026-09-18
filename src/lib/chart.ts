export interface ChartGeometry {
  /** Tracciato della linea, nello spazio del viewBox. */
  line: string;
  /** Stesso tracciato chiuso in basso, per il riempimento. */
  area: string;
  min: number;
  max: number;
  /** Valori delle linee orizzontali, dal più alto al più basso. */
  ticks: { value: number; topPercent: number }[];
}

const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 200;

/**
 * Geometria di un grafico a linea su viewBox fisso.
 *
 * L'SVG viene poi disegnato con preserveAspectRatio="none", così si adatta a
 * qualunque larghezza; lo spessore della linea resta costante grazie a
 * vector-effect, e le etichette sono HTML, quindi non si deformano.
 */
export function buildChartGeometry(values: number[], tickCount = 5): ChartGeometry | null {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  // Serie piatta: un intervallo minimo evita la divisione per zero e
  // centra la linea invece di appiattirla sul bordo.
  const range = max - min || Math.abs(max) * 0.001 || 1;

  const stepX = VIEW_WIDTH / (values.length - 1);
  const points = values.map((value, i) => ({
    x: i * stepX,
    y: VIEW_HEIGHT - ((value - min) / range) * VIEW_HEIGHT,
  }));

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  const area = `${line} L${VIEW_WIDTH},${VIEW_HEIGHT} L0,${VIEW_HEIGHT} Z`;

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const ratio = i / (tickCount - 1);
    return { value: max - range * ratio, topPercent: ratio * 100 };
  });

  return { line, area, min, max, ticks };
}

export const CHART_VIEWBOX = `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`;
