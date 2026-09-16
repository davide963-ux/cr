import type { IconName } from "@/components/icons/Icon";

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/**
 * ⚠️ AUDIT: "Regolamento istantaneo" è stato reso come "Regolamento rapido":
 * i tempi di regolamento dipendono dalle reti blockchain e dai servizi collegati.
 * Ripristinare "istantaneo" solo se tecnicamente verificato.
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
