/**
 * Converte un importo scritto a mano in centesimi interi.
 *
 * Il denaro non passa mai da un float: in JavaScript `12.34 * 100` fa
 * 1233.9999999999998. Qui le cifre si separano come testo e si sommano
 * come interi, così non c'è nulla da arrotondare.
 *
 * Il punto è ambiguo: "1.234" può valere milleduecentotrentaquattro oppure
 * uno virgola due tre quattro. In un campo di denaro indovinare male
 * significa sbagliare di mille volte, quindi quel caso viene RIFIUTATO e
 * l'utente deve disambiguare con la virgola.
 *
 * Accetta:  "1234"  "1234,56"  "1.234,56"  "1,234.56"  "12.34"  "1.234.567"
 * Rifiuta:  "1.234"  "12,345"  "-5"  "1e3"  "abc"
 */
export function parseAmountToCents(input: string): number | null {
  const raw = input.trim().replace(/\s/g, "");
  if (raw === "" || !/^[\d.,]+$/.test(raw)) return null;

  const lastComma = raw.lastIndexOf(",");
  const lastDot = raw.lastIndexOf(".");

  let integerPart: string;
  let fractionPart = "";

  if (lastComma !== -1 && lastDot !== -1) {
    // Entrambi presenti: l'ultimo separatore è quello decimale.
    const decimal = lastComma > lastDot ? "," : ".";
    const thousands = decimal === "," ? "." : ",";
    const parts = raw.split(decimal);
    if (parts.length !== 2) return null;
    integerPart = parts[0]!.split(thousands).join("");
    fractionPart = parts[1]!;
  } else if (lastComma !== -1) {
    // Solo virgole: in italiano è il separatore decimale.
    const parts = raw.split(",");
    if (parts.length !== 2) return null;
    integerPart = parts[0]!;
    fractionPart = parts[1]!;
  } else if (lastDot !== -1) {
    const parts = raw.split(".");
    if (parts.length === 2 && parts[1]!.length <= 2) {
      // "12.34": un punto con una o due cifre dopo è un decimale.
      integerPart = parts[0]!;
      fractionPart = parts[1]!;
    } else if (parts.length > 2 && parts.slice(1).every((p) => p.length === 3)) {
      // "1.234.567": più punti a gruppi di tre sono separatori di migliaia.
      integerPart = parts.join("");
    } else {
      // "1.234": ambiguo. Meglio un errore che un fattore mille.
      return null;
    }
  } else {
    integerPart = raw;
  }

  if (!/^\d+$/.test(integerPart)) return null;
  if (fractionPart !== "" && !/^\d{1,2}$/.test(fractionPart)) return null;

  const cents = Number(integerPart) * 100 + Number(fractionPart.padEnd(2, "0") || "0");
  return Number.isSafeInteger(cents) ? cents : null;
}
