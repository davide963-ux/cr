/**
 * Struttura unica dei dati di conto usata da tutta l'area riservata.
 * Le pagine leggono SOLO da qui: username e saldo non vanno mai riscritti
 * a mano in un componente.
 */
export interface AccountUser {
  /** Identificativo dell'utente autenticato. */
  id: string;
  /** Nome mostrato nei saluti e nelle intestazioni. */
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  city: string | null;
  /** Saldo disponibile. Oggi sempre 0: non esiste ancora un sistema di pagamenti. */
  balance: number;
  currency: "EUR";
  /** null finché il wallet non è configurato: non inventare mai un indirizzo. */
  walletAddress: string | null;
  /** Somma indicativa dichiarata in fase di registrazione. */
  declaredAmount: number | null;
}
