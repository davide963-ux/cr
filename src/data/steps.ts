export interface Step {
  id: string;
  title: string;
  description: string;
}

export const steps: Step[] = [
  { id: "registrati", title: "Registrati", description: "Crea il tuo account in pochi passaggi." },
  { id: "configura", title: "Configura", description: "Personalizza il tuo ambiente e gli strumenti che vuoi utilizzare." },
  { id: "analizza", title: "Analizza", description: "Accedi a dati, analisi e strumenti dedicati al mercato crypto." },
  { id: "opera", title: "Opera", description: "Utilizza la piattaforma secondo le funzionalità disponibili." },
];
