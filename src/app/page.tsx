import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { MarketSkeleton } from "@/components/ui/MarketState";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturedMarket, MarketBoard, MarketBoardShell } from "@/components/sections/MarketBlocks";
import { MultichainSection } from "@/components/sections/MultichainSection";
import { Reviews } from "@/components/sections/Reviews";
import { Statistics } from "@/components/sections/Statistics";
import { SuccessSection } from "@/components/sections/SuccessSection";
import { TradingTools } from "@/components/sections/TradingTools";

/**
 * Homepage. Ogni sezione è un componente autonomo; i dati arrivano
 * dai service (server) e non sono mai hardcoded nella UI.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* 2. Scheda BTC — sovrapposta al bordo inferiore dell'hero */}
      <section id="mercati" aria-label="Bitcoin in evidenza" className="relative -mt-10 sm:-mt-16">
        <Container>
          <Suspense fallback={<MarketSkeleton />}>
            <FeaturedMarket />
          </Suspense>
        </Container>
      </section>

      {/* 3. Principali asset */}
      <MarketBoardShell>
        <Suspense fallback={<MarketSkeleton rows={2} />}>
          <MarketBoard />
        </Suspense>
      </MarketBoardShell>

      <SuccessSection />
      <MultichainSection />
      <TradingTools />
      <HowItWorks />
      <Statistics />
      <Reviews />
      <FinalCTA />
    </>
  );
}
