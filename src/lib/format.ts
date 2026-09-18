import { siteConfig } from "@/data/content";

const { locale } = siteConfig;

/**
 * Formattazione deterministica di un importo: cifre raggruppate a tre, virgola
 * decimale, simbolo in coda.
 *
 * Intl NON va usato qui. Queste cifre compaiono sia nell'HTML del server sia
 * dopo l'idratazione, e per l'italiano i dati ICU impostano
 * minimumGroupingDigits=2: Node rende "1750,40 €", il browser "1.750,40 €".
 * Basta questa differenza a far fallire l'idratazione. Costruendo la stringa
 * a mano il risultato è identico ovunque.
 */
const SYMBOLS: Record<string, string> = { EUR: "€", GBP: "£", USD: "$" };

function groupDigits(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Divide un numero in parte intera e decimali, lavorando su interi. */
function splitFixed(value: number, decimals: number): { sign: string; whole: string; fraction: string } {
  const factor = 10 ** decimals;
  const units = Math.round(Math.abs(value) * factor);
  return {
    sign: value < 0 ? "-" : "",
    whole: Math.floor(units / factor).toString(),
    fraction: (units % factor).toString().padStart(decimals, "0"),
  };
}

/** Importo in una valuta esplicita, es. formatAmount(1750.4, "EUR") → 1.750,40 € */
export function formatAmount(value: number, currencyCode: string): string {
  const { sign, whole, fraction } = splitFixed(value, 2);
  return `${sign}${groupDigits(whole)},${fraction} ${SYMBOLS[currencyCode] ?? currencyCode}`;
}

/** Importo in bitcoin, es. 0,02435016 BTC. Otto decimali: un satoshi. */
export function formatBtc(value: number): string {
  const { sign, whole, fraction } = splitFixed(value, 8);
  return `${sign}${groupDigits(whole)},${fraction} BTC`;
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

