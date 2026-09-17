import { siteConfig } from "@/data/content";

const { locale } = siteConfig;

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

const btcFormatter = new Intl.NumberFormat(locale, {
  minimumFractionDigits: 8,
  maximumFractionDigits: 8,
});

/** Importo in bitcoin, es. 0,00209384 BTC. Otto decimali: un satoshi. */
export function formatBtc(value: number): string {
  return `${btcFormatter.format(value)} BTC`;
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

