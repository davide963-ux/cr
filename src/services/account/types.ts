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

/** Stato di una richiesta di prelievo, come definito nell'enum SQL. */
export type WithdrawalStatus = "pending" | "approved" | "rejected" | "cancelled";

/** Richiesta di prelievo, vista dall'utente che l'ha aperta. */
export interface Withdrawal {
  id: string;
  amount: number;
  /** null quando l'utente non l'ha indicata: si concorda con l'operatore. */
  destination: string | null;
  note: string | null;
  status: WithdrawalStatus;
  /** Motivo scritto dall'amministratore: presente solo sui rifiuti. */
  decisionReason: string | null;
  decidedAt: string | null;
  createdAt: string;
}

/** La stessa richiesta vista dal pannello, con l'utente a cui appartiene. */
export interface AdminWithdrawal extends Withdrawal {
  userId: string;
  userEmail: string;
  userName: string | null;
  decidedBy: string | null;
}
