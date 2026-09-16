import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoBadge } from "@/components/ui/DemoBadge";

/** Pagina segnaposto onesta: dichiara che il contenuto non è ancora disponibile. */
export function PlaceholderPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container className="flex min-h-[65vh] flex-col items-start justify-center py-24">
      <DemoBadge label="In preparazione" />
      <h1 className="font-display mt-6 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02]">{title}</h1>
      <div className="mt-5 max-w-xl space-y-3 text-lg text-mist">{children}</div>
      <ButtonLink href="/" variant="secondary" className="mt-10">
        Torna alla home
      </ButtonLink>
    </Container>
  );
}
