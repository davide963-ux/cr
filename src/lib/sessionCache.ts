/**
 * Piccola memoria di sessione con scadenza, per i dati chiesti a CoinGecko.
 *
 * L'API pubblica concede una decina di chiamate al minuto per indirizzo, e
 * ogni apertura della dashboard ne consuma più d'una: senza questa, qualche
 * ricaricamento di fila basta a farsi rifiutare tutto e a vedere comparire
 * «cambio non disponibile» al posto dei numeri.
 *
 * Ogni accesso è protetto: in una finestra anonima, con i dati di sito
 * bloccati o con lo spazio esaurito, sessionStorage non c'è o solleva. In quel
 * caso si procede senza memoria, non si smette di funzionare.
 */
export interface Cached<T> {
  /** Istante in cui il valore è stato scritto. */
  t: number;
  value: T;
}

export function readCache<T>(key: string): Cached<T> | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached<T>;
    return typeof parsed?.t === "number" && parsed.value !== undefined ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), value }));
  } catch {
    // Nessuna memoria disponibile: si continua a chiedere ogni volta.
  }
}

/** Entro un minuto il valore è buono: non si richiede nulla. */
export const FRESH_MS = 60_000;
/** Fino a dieci minuti si mostra subito e si aggiorna dietro le quinte. */
export const STALE_MS = 600_000;
