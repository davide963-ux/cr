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
  currency: "USD",
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
  email: "Email",
  emailPlaceholder: "nome@esempio.it",
  password: "Password",
  pending: "Attendi…",
};

export const authErrors = {
  callback: "Accesso non riuscito. Riprova.",
  notConfigured: "L'accesso non è ancora attivo: manca la configurazione del servizio di autenticazione.",
  missingFields: "Inserisci email e password.",
  invalidEmail: "Inserisci un indirizzo email valido.",
  weakPassword: "La password deve avere almeno 8 caratteri.",
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
 * TIPI E FUNZIONI DI SUPPORTO — non serve modificarli per cambiare i testi.
 * =========================================================================== */

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
