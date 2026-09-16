/**
 * Sanificazione di testo proveniente da fonti esterne o da input utente.
 * React esegue già l'escape dell'HTML in fase di render: qui normalizziamo
 * il contenuto (caratteri di controllo, tag, spazi, lunghezza) prima di
 * mostrarlo o salvarlo. Non usare mai dangerouslySetInnerHTML con questi valori.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const TAGS = /<[^>]*>/g;

export function sanitizeText(input: unknown, maxLength = 1000): string {
  if (typeof input !== "string") return "";
  return input
    .replace(CONTROL_CHARS, "")
    .replace(TAGS, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

export function toFiniteOrNull(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}
