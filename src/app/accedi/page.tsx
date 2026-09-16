import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/PlaceholderPage";

export const metadata: Metadata = { title: "Accedi", robots: { index: false } };

/**
 * Nessun form di login finto: l'autenticazione reale (es. Auth.js, Clerk,
 * provider OIDC) verrà integrata lato server con sessioni sicure.
 */
export default function LoginPage() {
  return (
    <PlaceholderPage title="Accedi">
      <p>L&apos;area riservata non è ancora attiva.</p>
      <p>L&apos;accesso sarà disponibile al lancio della piattaforma.</p>
    </PlaceholderPage>
  );
}
