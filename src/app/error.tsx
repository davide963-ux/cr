"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Punto di aggancio per il monitoraggio (Sentry, ecc.)
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-24">
      <h1 className="font-display text-4xl">Questa pagina non si è caricata.</h1>
      <p className="mt-4 max-w-md text-mist">Si è verificato un errore imprevisto. Riprova: se il problema persiste, torna più tardi.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 h-11 rounded-[var(--radius-control)] bg-mint px-5 font-medium text-ink hover:bg-[#82ecbf]"
      >
        Riprova
      </button>
    </Container>
  );
}
