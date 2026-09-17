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
  /** Saldo in euro, derivato dai centesimi salvati nel database. */
  balance: number;
  currency: "EUR";
  /** null finché il wallet non è configurato: non inventare mai un indirizzo. */
  walletAddress: string | null;
  /** Somma indicativa dichiarata in fase di registrazione. */
  declaredAmount: number | null;
  /** Vero solo se il flag è impostato nel database, mai deducibile dal client. */
  isAdmin: boolean;
  /**
   * false quando la tabella `profiles` non esiste ancora (migrazione non
   * eseguita): l'interfaccia lo dice, invece di mostrare un saldo inventato.
   */
  profileReady: boolean;
}

/** Riga del registro movimenti. */
export interface LedgerEntry {
  id: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  createdAt: string;
}

/** Riga dell'elenco utenti nel pannello di amministrazione. */
export interface AdminUserRow {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  city: string | null;
  balance: number;
  currency: string;
  isAdmin: boolean;
  createdAt: string;
}
