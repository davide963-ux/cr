import { cn } from "@/lib/cn";

/**
 * Monogramma neutro dell'asset. Non riproduce i loghi ufficiali:
 * per usarli servono asset con licenza/linee guida del brand.
 */
export function CoinMark({
  symbol,
  tint,
  size = 40,
  className,
}: {
  symbol: string;
  tint: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("font-wide grid shrink-0 place-items-center rounded-full font-semibold", className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
        color: tint,
        background: `color-mix(in srgb, ${tint} 12%, #0d1512)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tint} 35%, transparent)`,
      }}
    >
      {symbol.slice(0, 3)}
    </span>
  );
}
