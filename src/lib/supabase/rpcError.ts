import "server-only";

/** Forma dell'errore restituito da supabase-js, sia da PostgREST sia da Postgres. */
export interface SupabaseErrorLike {
  code?: string | null;
  message?: string | null;
  details?: string | null;
  hint?: string | null;
}

/**
 * Codici che significano "lo schema non è quello che il codice si aspetta".
 *
 * I PGRST* arrivano da PostgREST, che risponde da sé senza nemmeno interpellare
 * Postgres quando non trova la funzione o la tabella nella propria cache: per
 * questo un 42883 (funzione inesistente) non si vede mai da supabase-js, e
 * cercare solo quello lasciava passare il caso più frequente di tutti — la
 * migrazione non ancora eseguita — fino al messaggio generico.
 *
 * PGRST202: funzione assente dalla cache dello schema.
 * PGRST203: più funzioni con lo stesso nome, nessuna scelta possibile.
 * PGRST204/205: colonna o tabella assente dalla cache.
 */
const SCHEMA_MISSING = new Set([
  "PGRST202",
  "PGRST203",
  "PGRST204",
  "PGRST205",
  "42883",
  "42P01",
  "42703",
  "42704",
]);

export function isSchemaMissing(code: string): boolean {
  return SCHEMA_MISSING.has(code);
}

/**
 * Registra l'errore per intero e ne restituisce il codice.
 *
 * Senza questo, un codice non previsto diventava soltanto "Operazione non
 * riuscita" sullo schermo e spariva: nessuna traccia nei log del server per
 * capire cosa fosse andato storto. Il messaggio di Postgres non va mostrato
 * all'utente, ma va scritto da qualche parte.
 */
export function logRpcError(operation: string, error: SupabaseErrorLike | null): string {
  const code = error?.code ?? "unknown";
  console.error(`[supabase] ${operation} non riuscita`, {
    code,
    message: error?.message ?? null,
    details: error?.details ?? null,
    hint: error?.hint ?? null,
  });
  return code;
}
