import type { Metadata } from "next";
import { Card, EmptyState } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { analyticsPage } from "@/data/content";

export const metadata: Metadata = { title: "Analitiche" };

/**
 * Solo struttura visiva: senza attività sul conto non c'è nulla da diagrammare,
 * e un grafico inventato su una piattaforma finanziaria è peggio di uno spazio
 * vuoto. Ogni card è pronta ad accogliere il grafico vero.
 */
export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader title={analyticsPage.title} />
      <p className="max-w-xl text-mist">{analyticsPage.description}</p>

      <div className="grid gap-5 lg:grid-cols-2">
        {analyticsPage.cards.map((card, i) => (
          <Card
            key={card.id}
            title={card.title}
            // L'ultima card resta a tutta larghezza quando il numero è dispari
            className={i === analyticsPage.cards.length - 1 && analyticsPage.cards.length % 2 ? "lg:col-span-2" : ""}
          >
            <EmptyState message={analyticsPage.emptyState} icon="chart" />
          </Card>
        ))}
      </div>
    </div>
  );
}
