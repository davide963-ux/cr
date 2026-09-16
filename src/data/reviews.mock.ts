/**
 * ⚠️ RECENSIONI DIMOSTRATIVE — persone e testi di fantasia.
 * Non sono recensioni Google né testimonianze reali.
 */
export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  /** ISO 8601 */
  date: string;
  avatarUrl?: string;
  source: "demo" | "google";
}

export const mockReviews: Review[] = [
  {
    id: "demo-1",
    author: "Giulia Marchetti",
    rating: 5,
    text: "Interfaccia ordinata e leggibile. Trovo in pochi secondi i dati che mi servono, anche da telefono.",
    date: "2026-08-28",
    source: "demo",
  },
  {
    id: "demo-2",
    author: "Luca Ferraro",
    rating: 4,
    text: "Mi piace poter vedere più reti nello stesso posto. Aspetto altre funzioni di analisi, ma la base è solida.",
    date: "2026-08-19",
    source: "demo",
  },
  {
    id: "demo-3",
    author: "Chiara Colombo",
    rating: 5,
    text: "Il supporto mi ha risposto con chiarezza durante la configurazione iniziale. Procedura semplice.",
    date: "2026-08-07",
    source: "demo",
  },
  {
    id: "demo-4",
    author: "Marco Esposito",
    rating: 4,
    text: "Grafici puliti e nessuna distrazione. Uso la piattaforma soprattutto per seguire l'andamento del mercato.",
    date: "2026-07-30",
    source: "demo",
  },
];
