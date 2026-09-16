/**
 * Testi editoriali della homepage, separati dai componenti.
 * Modificare qui i contenuti senza toccare la UI.
 */
export const heroContent = {
  title: "Il futuro delle crypto è qui.",
  description:
    "Una piattaforma digitale pensata per offrire strumenti avanzati, analisi e accesso ai mercati crypto in un unico ecosistema.",
  note: "Le cripto-attività sono volatili e comportano il rischio di perdita del capitale.",
};

export const marketContent = {
  title: "I principali asset crypto",
  description: "Prezzo e variazione nelle ultime 24 ore per gli asset più seguiti.",
};

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

export const multichainContent = {
  title: "Copertura multichain.",
  description:
    "La piattaforma è progettata per lavorare su più ecosistemi blockchain, con un'unica interfaccia per consultare asset e reti diverse.",
  hubLabel: "Piattaforma",
  hubDetail: "Un'unica interfaccia",
  moreLabel: "Altre reti potranno essere aggiunte in futuro.",
};

export const toolsContent = {
  title: "Strumenti potenti per il trading.",
  description: "Le basi su cui è costruita la piattaforma.",
};

export const howItWorksContent = {
  title: "Come funziona",
  description: "Quattro passaggi per iniziare.",
};

export const statsContent = {
  title: "Una piattaforma costruita per crescere.",
  description: "Gli indicatori che pubblicheremo man mano che la piattaforma cresce.",
};

export const reviewsContent = {
  title: "Cosa dicono i nostri clienti",
  demoNote: "Recensioni dimostrative — sostituire con recensioni verificate prima della pubblicazione.",
};

export const finalCtaContent = {
  title: "Pronto a entrare nel futuro delle crypto?",
  description: "Scopri una nuova generazione di strumenti digitali dedicati al mondo degli asset digitali.",
};

/** ⚠️ Testo segnaposto: deve essere redatto e validato dal consulente legale. */
export const legalDisclaimer = [
  "Le cripto-attività sono strumenti altamente volatili e non adatti a tutti. Il loro valore può variare in modo significativo e anche azzerarsi: è possibile perdere l'intero capitale impiegato.",
  "I contenuti di questo sito hanno finalità esclusivamente informative e non costituiscono consulenza finanziaria, legale o fiscale, né offerta o sollecitazione all'investimento. I dati di mercato, le statistiche e le recensioni mostrati sono dimostrativi.",
  "[Informazioni societarie, eventuali autorizzazioni e riferimenti normativi da inserire dopo la verifica legale.]",
];
