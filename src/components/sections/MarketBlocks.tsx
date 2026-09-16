import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { MarketError } from "@/components/ui/MarketState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { marketContent } from "@/data/content";
import { getMarketSnapshot } from "@/services/market/marketDataService";
import { LiveBitcoinCard } from "./LiveBitcoinCard";
import { LiveMarketGrid } from "./LiveMarketGrid";

/**
 * Server Component asincroni: leggono i dati dal service per il primo
 * render (SEO/no-JS) e li passano ai wrapper client `Live*`, che li
 * mantengono aggiornati via polling su /api/market. Sono avvolti in
 * <Suspense> nella pagina, così uno skeleton appare mentre arrivano.
 */
export async function FeaturedMarket() {
  const result = await getMarketSnapshot();
  if (result.status === "error") return <MarketError message={result.message} />;
  return <LiveBitcoinCard initial={result.data} />;
}

export async function MarketBoard() {
  const result = await getMarketSnapshot();
  return (
    <>
      <SectionHeader
        id="asset-title"
        title={marketContent.title}
        description={marketContent.description}
        aside={result.status === "ok" && result.data.isDemo ? <DemoBadge /> : null}
      />
      <div className="mt-12">
        {result.status === "error" ? (
          <MarketError message={result.message} />
        ) : (
          <LiveMarketGrid initial={result.data} />
        )}
      </div>
    </>
  );
}

export function MarketBoardShell({ children }: { children: ReactNode }) {
  return (
    <section aria-labelledby="asset-title" id="asset" className="py-24 sm:py-32">
      <Container>{children}</Container>
    </section>
  );
}
