import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Cornice del sito pubblico. L'area riservata ha la propria
 * (src/app/dashboard/layout.tsx) e non mostra navbar né footer.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
