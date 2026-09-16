import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { MarketError } from "@/components/ui/MarketState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { marketContent } from "@/data/content";
import { getMarketSnapshot } from "@/services/market/marketDataService";
import { BitcoinCard } from "./BitcoinCard";
import { CryptoMarketGrid } from "./CryptoMarketGrid";

/**
 * Server Component asincroni: leggono i dati dal service e delegano
 * la resa ai componenti presentazionali. Sono avvolti in <Suspense>
 * nella pagina, così uno skeleton appare mentre i dati arrivano.
 */
export async function FeaturedMarket() {
  const result = await getMarketSnapshot();
  if (result.status === "error") return <MarketError message={result.message} />;
  return <BitcoinCard asset={result.data.featured} isDemo={result.data.isDemo} />;
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
          <CryptoMarketGrid assets={result.data.assets} />
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
