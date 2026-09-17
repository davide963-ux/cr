import { siteConfig } from "@/data/content";

const { locale, currency } = siteConfig;

const priceFormatters = new Map<number, Intl.NumberFormat>();

/** Numero di decimali adattivo: gli asset a basso prezzo richiedono più precisione. */
function priceDecimals(value: number): number {
  const abs = Math.abs(value);
  if (abs >= 1) return 2;
  if (abs >= 0.01) return 4;
  return 6;
}

/** Prezzo in valuta, es. 104.582,32 $ */
export function formatPrice(value: number): string {
  const decimals = priceDecimals(value);
  let fmt = priceFormatters.get(decimals);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    priceFormatters.set(decimals, fmt);
  }
  return fmt.format(value);
}

/** Scompone il prezzo in parte intera e decimali, per tipografia differenziata. */
export function splitPrice(value: number): { main: string; fraction: string } {
  const formatted = formatPrice(value);
  const idx = formatted.lastIndexOf(",");
  if (idx === -1) return { main: formatted, fraction: "" };
  return { main: formatted.slice(0, idx), fraction: formatted.slice(idx) };
}

const amountFormatters = new Map<string, Intl.NumberFormat>();

/** Importo in una valuta esplicita, es. formatAmount(0, "EUR") → 0,00 € */
export function formatAmount(value: number, currencyCode: string): string {
  let fmt = amountFormatters.get(currencyCode);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    amountFormatters.set(currencyCode, fmt);
  }
  return fmt.format(value);
}

const compactCurrency = new Intl.NumberFormat(locale, {
  style: "currency",
  currency,
  currencyDisplay: "narrowSymbol",
  notation: "compact",
  maximumFractionDigits: 2,
});

/** Importi grandi in forma compatta, es. 2,07 Bln $ */
export function formatCompactCurrency(value: number | null): string {
  return value === null ? "—" : compactCurrency.format(value);
}

const pct = new Intl.NumberFormat(locale, {
  style: "percent",
  signDisplay: "exceptZero",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Variazione percentuale con segno. Input in punti percentuali (2.84 → +2,84%). */
export function formatChangePct(valuePct: number): string {
  return pct.format(valuePct / 100);
}

/**
 * Formattazione numerica deterministica (usata anche lato client dai contatori):
 * evita la notazione "compact" di ICU, che può differire tra Node e browser
 * e causare hydration mismatch.
 */
export function formatFixed(value: number, decimals: number): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const dateFmt = new Intl.DateTimeFormat(locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

const timeFmt = new Intl.DateTimeFormat(locale, {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

export function formatDateTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}
