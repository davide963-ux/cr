import type { IconName } from "@/components/icons/Icon";

/**
 * ============================================================================
 * TUTTI I TESTI DEL SITO, IN UN UNICO FILE.
 * ============================================================================
 *
 * Le sezioni sono nell'ordine in cui compaiono nella pagina, dall'alto verso
 * il basso: scorrendo questo file si scorre il sito.
 *
 * Per modificare un testo basta cambiare quello che sta fra virgolette.
 * Regole minime per non rompere la build:
 *   - non togliere le virgolette né la virgola a fine riga;
 *   - gli apostrofi vanno bene dentro le virgolette doppie ("un'unica");
 *   - per andare a capo in un paragrafo, aggiungere una nuova stringa
 *     all'elenco fra parentesi quadre.
 *
 * In fondo al file ci sono i tipi e due funzioni di supporto: non serve
 * toccarli per cambiare i testi.
 */

/* ===========================================================================
 * 1. DATI GENERALI DEL SITO
 * =========================================================================== */

export const siteConfig = {
  name: "Nome Azienda",
  legalName: "[Nome Azienda]",
  description:
    "Una piattaforma digitale pensata per offrire strumenti avanzati, analisi e accesso ai mercati crypto in un unico ecosistema.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "it-IT",
  ogLocale: "it_IT",
  copyrightYear: 2026,
  /** true finché il sito mostra dati dimostrativi: abilita i badge "Dati dimostrativi". */
  demoMode: true,
} as const;

/* ===========================================================================
 * 2. BARRA DI NAVIGAZIONE (in alto)
 * =========================================================================== */

/** Voci del menu principale: sono ancore che puntano alle sezioni della homepage. */
export const mainNav: NavLink[] = [
  { label: "Mercati", href: "/#mercati" },
  { label: "Trading", href: "/#trading" },
  { label: "Analisi", href: "/#analisi" },
  { label: "Multichain", href: "/#multichain" },
  { label: "Come funziona", href: "/#come-funziona" },
];

export const authLinks = {
  login: { label: "Accedi", href: "/accedi" },
  register: { label: "Registrati", href: "/registrati" },
} as const;

/* ===========================================================================
 * 3. HERO (prima schermata)
 * =========================================================================== */

export const heroContent = {
  title: "Il futuro delle crypto è qui.",
  description:
    "Una piattaforma digitale pensata per offrire strumenti avanzati, analisi e accesso ai mercati crypto in un unico ecosistema.",
  note: "Le cripto-attività sono volatili e comportano il rischio di perdita del capitale.",
};

/* ===========================================================================
 * 4. MERCATI (scheda Bitcoin + griglia asset)
 * I prezzi arrivano dai widget e non si modificano da qui.
 * =========================================================================== */

export const marketContent = {
  title: "I principali asset crypto",
  description: "Prezzo e variazione nelle ultime 24 ore per gli asset più seguiti.",
};

/* ===========================================================================
 * 5. TASSO DI SUCCESSO
 * =========================================================================== */

export const successContent = {
  // ⚠️ AUDIT: "comprovato" afferma l'esistenza di una prova. Mantenere questo
  // titolo solo quando saranno disponibili dati verificati e pubblicabili.
  title: "Tasso di successo comprovato.",
  subtitle: "Routing AI e specialisti umani insieme per risultati di alto livello.",
  body: [
    "I modelli automatici elaborano grandi quantità di dati di mercato e mettono in evidenza segnali, anomalie e scenari da approfondire.",
    "Gli specialisti valutano quanto emerso, aggiungono contesto e decidono cosa proporre. Il risultato è un supporto alle decisioni: la scelta finale resta sempre all'utente.",
  ],
  /** null = nessun dato verificato disponibile → viene mostrato il segnaposto. */
  verifiedMetric: null as null | { value: string; label: string; source: string },
  placeholderLabel: "Dati verificati in arrivo",
  placeholderHint: "Le metriche saranno pubblicate solo dopo una verifica indipendente.",
  flow: [
    { title: "Mercato", detail: "Prezzi, volumi e dati on-chain" },
    { title: "AI Analysis", detail: "Modelli che filtrano e classificano i segnali" },
    { title: "Human Expertise", detail: "Specialisti che verificano e contestualizzano" },
    { title: "Decision Support", detail: "Informazioni chiare per decidere in autonomia" },
  ],
  disclaimer:
    "Nessun sistema di analisi garantisce rendimenti. Le performance passate non sono indicative di quelle future.",
};

/* ===========================================================================
 * 6. COPERTURA MULTICHAIN
 * L'elenco delle blockchain sta in src/data/chains.ts
 * =========================================================================== */

export const multichainContent = {
  title: "Copertura multichain.",
  description:
    "La piattaforma è progettata per lavorare su più ecosistemi blockchain, con un'unica interfaccia per consultare asset e reti diverse.",
  hubLabel: "Piattaforma",
  hubDetail: "Un'unica interfaccia",
  moreLabel: "Altre reti potranno essere aggiunte in futuro.",
};

/* ===========================================================================
 * 7. STRUMENTI PER IL TRADING
 * =========================================================================== */

export const toolsContent = {
  title: "Strumenti potenti per il trading.",
  description: "Le basi su cui è costruita la piattaforma.",
};

/**
 * ⚠️ AUDIT: "Regolamento istantaneo" è stato reso come "Regolamento rapido":
 * i tempi di regolamento dipendono dalle reti blockchain e dai servizi collegati.
 * Ripristinare "istantaneo" solo se tecnicamente verificato.
 *
 * `icon` sceglie l'icona: shield, bolt, support, chart, settle.
 */
export const features: Feature[] = [
  {
    id: "sicurezza",
    title: "Sicurezza",
    description: "Protezione dei dati e delle operazioni progettata secondo standard moderni.",
    icon: "shield",
  },
  {
    id: "velocita",
    title: "Velocità fulminea",
    description: "Infrastruttura progettata per offrire un'esperienza rapida e reattiva.",
    icon: "bolt",
  },
  {
    id: "supporto",
    title: "Supporto",
    description: "Assistenza pensata per accompagnare gli utenti durante l'utilizzo della piattaforma.",
    icon: "support",
  },
  {
    id: "analisi",
    title: "Analisi avanzate",
    description: "Strumenti e dati per comprendere meglio il mercato.",
    icon: "chart",
  },
  {
    id: "regolamento",
    title: "Regolamento rapido",
    description:
      "Processi pensati per ridurre i tempi di attesa, nei limiti delle reti blockchain e dei servizi collegati.",
    icon: "settle",
  },
];

/* ===========================================================================
 * 8. COME FUNZIONA
 * =========================================================================== */

export const howItWorksContent = {
  title: "Come funziona",
  description: "Quattro passaggi per iniziare.",
};

export const steps: Step[] = [
  { id: "registrati", title: "Registrati", description: "Crea il tuo account in pochi passaggi." },
  { id: "configura", title: "Configura", description: "Personalizza il tuo ambiente e gli strumenti che vuoi utilizzare." },
  { id: "analizza", title: "Analizza", description: "Accedi a dati, analisi e strumenti dedicati al mercato crypto." },
  { id: "opera", title: "Opera", description: "Utilizza la piattaforma secondo le funzionalità disponibili." },
];

/* ===========================================================================
 * 9. STATISTICHE
 * I numeri stanno in src/data/stats.mock.ts
 * =========================================================================== */

export const statsContent = {
  title: "Una piattaforma costruita per crescere.",
  description: "Gli indicatori che pubblicheremo man mano che la piattaforma cresce.",
  demoBadgeLabel: "Valori dimostrativi da sostituire",
};

/* ===========================================================================
 * 10. RECENSIONI
 * I testi delle singole recensioni stanno in src/data/reviews.mock.ts
 * =========================================================================== */

export const reviewsContent = {
  title: "Cosa dicono i nostri clienti",
  demoNote: "Recensioni dimostrative — sostituire con recensioni verificate prima della pubblicazione.",
  demoBadgeLabel: "Recensioni dimostrative",
};

/* ===========================================================================
 * 11. INVITO FINALE
 * =========================================================================== */

export const finalCtaContent = {
  title: "Pronto a entrare nel futuro delle crypto?",
  description: "Scopri una nuova generazione di strumenti digitali dedicati al mondo degli asset digitali.",
};

/* ===========================================================================
 * 12. FOOTER
 * =========================================================================== */

/**
 * Pagine informative non ancora redatte.
 * Vengono generate come segnaposto (noindex) da app/[slug]/page.tsx,
 * così nessun link del footer porta a un 404.
 * A sinistra l'indirizzo della pagina, a destra il titolo mostrato.
 */
export const placeholderPages = {
  "chi-siamo": "Chi siamo",
  contatti: "Contatti",
  carriere: "Carriere",
  "centro-assistenza": "Centro assistenza",
  faq: "FAQ",
  "privacy-policy": "Privacy Policy",
  "cookie-policy": "Cookie Policy",
  "termini-e-condizioni": "Termini e condizioni",
  disclaimer: "Disclaimer",
} as const;

export const footerNav: NavGroup[] = [
  {
    title: "Piattaforma",
    links: [
      { label: "Mercati", href: "/#mercati" },
      { label: "Trading", href: "/#trading" },
      { label: "Analisi", href: "/#analisi" },
      { label: "Multichain", href: "/#multichain" },
    ],
  },
  { title: "Azienda", links: [page("chi-siamo"), page("contatti"), page("carriere")] },
  { title: "Supporto", links: [page("centro-assistenza"), page("faq"), page("contatti")] },
  {
    title: "Legale",
    links: [page("privacy-policy"), page("cookie-policy"), page("termini-e-condizioni"), page("disclaimer")],
  },
];

/* ===========================================================================
 * 13. TESTO LEGALE
 * =========================================================================== */

/** ⚠️ Testo segnaposto: deve essere redatto e validato dal consulente legale. */
export const legalDisclaimer = [
  "Le cripto-attività sono strumenti altamente volatili e non adatti a tutti. Il loro valore può variare in modo significativo e anche azzerarsi: è possibile perdere l'intero capitale impiegato.",
  "I contenuti di questo sito hanno finalità esclusivamente informative e non costituiscono consulenza finanziaria, legale o fiscale, né offerta o sollecitazione all'investimento. I dati di mercato, le statistiche e le recensioni mostrati sono dimostrativi.",
  "[Informazioni societarie, eventuali autorizzazioni e riferimenti normativi da inserire dopo la verifica legale.]",
];

/* ===========================================================================
 * 14. PAGINE DI ACCESSO E REGISTRAZIONE
 * =========================================================================== */

export const loginContent = {
  title: "Accedi",
  description: "Entra nella tua area riservata con email e password.",
  button: "Accedi",
  switchPrompt: "Non hai ancora un account?",
  switchLink: "Registrati",
};

export const registerContent = {
  title: "Crea il tuo account",
  description: "Serve solo un indirizzo email valido e una password.",
  button: "Crea account",
  switchPrompt: "Hai già un account?",
  switchLink: "Accedi",
  passwordHint: "Almeno 8 caratteri.",
  /** Mostrato sotto al modulo: l'utente sta comunque creando un account. */
  legalNote:
    "Proseguendo accetti i Termini e condizioni e la Privacy Policy. Questa è una versione dimostrativa: non inserire dati sensibili.",
};

export const authFormLabels = {
  firstName: "Nome",
  lastName: "Cognome",
  email: "Email",
  emailPlaceholder: "nome@esempio.it",
  phone: "Telefono",
  phonePlaceholder: "+39 333 1234567",
  city: "Città",
  amount: "La somma",
  amountPlaceholder: "1000",
  amountHint: "Importo indicativo in EUR. Nessun pagamento viene richiesto ora.",
  password: "Password",
  pending: "Attendi…",
};

export const authErrors = {
  callback: "Accesso non riuscito. Riprova.",
  notConfigured: "L'accesso non è ancora attivo: manca la configurazione del servizio di autenticazione.",
  missingFields: "Inserisci email e password.",
  invalidEmail: "Inserisci un indirizzo email valido.",
  weakPassword: "La password deve avere almeno 8 caratteri.",
  missingProfileFields: "Compila nome, cognome, telefono e città.",
  invalidPhone: "Inserisci un numero di telefono valido.",
  invalidAmount: "Inserisci una somma valida.",
  /** Volutamente generico: non rivela quali email siano già registrate. */
  badCredentials: "Email o password non corretti.",
  signUpFailed: "Registrazione non riuscita. Controlla i dati e riprova.",
  confirmEmail: "Ti abbiamo inviato un'email di conferma: aprila per attivare l'account.",
};

export const dashboardContent = {
  title: "La tua area riservata",
  welcome: "Bentornato",
  description: "Qui comparirà la tua dashboard. Per ora l'accesso funziona: sei autenticato.",
  signOut: "Esci",
};

/* ===========================================================================
 * 15. AREA RISERVATA (dashboard)
 * =========================================================================== */

/** Voci del menu laterale. `href` decide anche quale voce risulta attiva. */
export const dashboardNav: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Portafoglio", href: "/dashboard/portafoglio", icon: "wallet" },
  { label: "Analitiche", href: "/dashboard/analitiche", icon: "chart" },
  { label: "Profilo", href: "/dashboard/profilo", icon: "user" },
  { label: "Sicurezza", href: "/dashboard/sicurezza", icon: "shield" },
  { label: "Documentazione", href: "/dashboard/documentazione", icon: "document" },
];

export const dashboardShell = {
  menuOpen: "Apri il menu",
  menuClose: "Chiudi il menu",
  navLabel: "Navigazione area riservata",
  signOut: "Esci",
};

export const dashboardHome = {
  title: "Dashboard",
  welcome: "Benvenuto",
  balanceLabel: "Saldo disponibile",
  currencyLabel: "Valuta",
  balanceNote: "Il saldo sarà aggiornato quando il sistema di pagamenti sarà collegato.",
  btcLoading: "Conversione in corso…",
  btcUnavailable: "Conversione in bitcoin non disponibile al momento.",
  /** `{rate}` viene sostituito col cambio usato per il calcolo. */
  btcRate: "1 BTC = {rate} · valore indicativo",
  walletTitle: "Il tuo wallet",
  walletAddressLabel: "Indirizzo wallet",
  walletEmpty: "Wallet non ancora configurato",
  deposit: "Deposita",
  depositModalTitle: "Deposito non ancora disponibile",
  depositModalBody:
    "La funzione di deposito sarà attiva quando il sistema wallet sarà collegato. Nessun pagamento viene elaborato in questa versione.",
};

export const walletPage = {
  title: "Il tuo portafoglio",
  usernameLabel: "Username",
  balanceLabel: "Saldo",
  manageTitle: "Gestione wallet",
  addressLabel: "Indirizzo wallet",
  addressEmpty: "Wallet non ancora configurato",
  exportKey: "Esporta chiave",
  exportNote: "Funzionalità wallet in fase di configurazione.",
  exportModalTitle: "Esportazione chiave non disponibile",
  exportModalBody:
    "L'esportazione della chiave sarà possibile solo quando il sistema wallet sarà collegato, con le dovute verifiche di sicurezza. Nessuna chiave viene generata o conservata in questa versione.",
};

export const analyticsPage = {
  title: "Analitiche",
  description: "Le metriche compariranno qui man mano che il conto registrerà attività.",
  emptyState: "Dati disponibili quando saranno presenti attività sul conto.",
  cards: [
    { id: "performance", title: "Performance" },
    { id: "movimenti", title: "Movimenti" },
    { id: "distribuzione", title: "Distribuzione del portafoglio" },
    { id: "attivita", title: "Attività" },
    { id: "storico", title: "Storico" },
  ],
};

export const profilePage = {
  title: "Profilo",
  personalTitle: "Informazioni personali",
  preferencesTitle: "Preferenze",
  accountTitle: "Dati dell'account",
  edit: "Modifica profilo",
  editModalTitle: "Modifica del profilo non ancora disponibile",
  editModalBody: "La modifica dei dati sarà attiva in una prossima versione.",
  empty: "Non impostato",
  fields: {
    username: "Username",
    email: "Email",
    firstName: "Nome",
    lastName: "Cognome",
    phone: "Telefono",
    city: "Città",
    currency: "Valuta",
    declaredAmount: "Somma indicata alla registrazione",
  },
  preferencesEmpty: "Nessuna preferenza da configurare al momento.",
};

export const securityPage = {
  title: "Sicurezza",
  passwordTitle: "Password",
  passwordMask: "••••••••••",
  passwordButton: "Modifica password",
  passwordModalTitle: "Modifica password non ancora disponibile",
  passwordModalBody: "Il cambio password sarà attivo in una prossima versione.",
  twoFactorTitle: "Autenticazione a due fattori",
  twoFactorStatusLabel: "Stato",
  twoFactorStatus: "Non configurata",
  twoFactorButton: "Configura 2FA",
  twoFactorModalTitle: "Autenticazione a due fattori non ancora disponibile",
  twoFactorModalBody: "La configurazione del secondo fattore sarà attiva in una prossima versione.",
  sessionsTitle: "Sessioni attive",
  sessionsEmpty: "Nessuna sessione aggiuntiva disponibile.",
};

export const documentsPage = {
  title: "Documentazione",
  uploadTitle: "Carica documentazione",
  uploadDescription: "Carica i documenti richiesti per le operazioni di pagamento.",
  dropzone: "Trascina qui i tuoi documenti oppure seleziona un file.",
  selectFile: "Seleziona file",
  accepted: "Formati accettati: PNG, JPG, PDF. Dimensione massima 10 MB.",
  statusReady: "Pronto per il caricamento",
  remove: "Rimuovi",
  removeLabel: "Rimuovi il file",
  errorType: "Formato non supportato. Sono ammessi PNG, JPG e PDF.",
  errorSize: "File troppo grande. Il limite è 10 MB.",
  notUploaded: "I file restano nel browser: non vengono ancora inviati a nessun server.",
  paymentsTitle: "Documenti relativi ai pagamenti",
  paymentsEmpty: "Non sono ancora presenti documenti.",
  paymentsColumns: ["ID pagamento", "Documento", "Data di caricamento", "Stato", "Verifica"],
};

/* ===========================================================================
 * 16. PANNELLO DI AMMINISTRAZIONE
 * =========================================================================== */

export const adminPage = {
  navLabel: "Amministrazione",
  title: "Amministrazione",
  description: "Elenco dei conti e rettifiche di saldo. Ogni movimento resta nel registro.",
  usersTitle: "Utenti",
  usersEmpty: "Nessun utente registrato.",
  ledgerTitle: "Ultimi movimenti",
  ledgerEmpty: "Nessun movimento registrato.",
  columns: {
    user: "Utente",
    contact: "Contatti",
    balance: "Saldo",
    role: "Ruolo",
    actions: "Rettifica",
    amount: "Importo",
    reason: "Motivo",
    date: "Data",
    balanceAfter: "Saldo dopo",
  },
  roleAdmin: "Amministratore",
  roleUser: "Utente",
  promote: "Rendi amministratore",
  demote: "Revoca amministratore",
  credit: "Accredita",
  debit: "Addebita",
  amountLabel: "Importo in euro",
  amountPlaceholder: "50,00",
  reasonLabel: "Motivo",
  reasonPlaceholder: "Deposito del 12/09 non accreditato",
  submit: "Registra movimento",
  pending: "Attendi…",
  adjustDone: "Movimento registrato.",
  roleDone: "Ruolo aggiornato.",
  totalBalance: "Somma dei saldi",
  totalUsers: "Utenti registrati",
  migrationTitle: "Database non ancora predisposto",
  migrationBody:
    "Esegui supabase/migrations/0001_profiles_and_ledger.sql nell'SQL Editor di Supabase, poi assegna il primo amministratore.",
  errors: {
    notAuthorised: "Non hai i permessi per questa operazione.",
    userNotFound: "Utente non trovato.",
    invalidAmount: "Importo non valido. Usa la virgola per i decimali, ad esempio 1234,56.",
    invalidInput: "Dati non validi.",
    reasonRequired: "Indica il motivo del movimento.",
    outOfRange: "Importo fuori scala.",
    constraint: "Operazione rifiutata: il saldo non può diventare negativo.",
    migrationMissing: "Il database non è ancora predisposto: esegui la migrazione SQL.",
    generic: "Operazione non riuscita. Riprova.",
  },
};

/* ===========================================================================
 * TIPI E FUNZIONI DI SUPPORTO — non serve modificarli per cambiare i testi.
 * =========================================================================== */

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: IconName;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface Step {
  id: string;
  title: string;
  description: string;
}

export type PlaceholderSlug = keyof typeof placeholderPages;

export function isPlaceholderSlug(slug: string): slug is PlaceholderSlug {
  return Object.hasOwn(placeholderPages, slug);
}

/** Costruisce il link a una pagina segnaposto usando il titolo già definito sopra. */
function page(slug: PlaceholderSlug): NavLink {
  return { label: placeholderPages[slug], href: `/${slug}` };
}
