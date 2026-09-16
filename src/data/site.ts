/**
 * Configurazione globale del sito.
 * I campi segnaposto (nome azienda, dati legali) vanno sostituiti
 * con informazioni verificate prima della pubblicazione.
 */
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
