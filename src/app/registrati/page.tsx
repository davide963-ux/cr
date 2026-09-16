import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/pages/PlaceholderPage";

export const metadata: Metadata = { title: "Registrati", robots: { index: false } };

export default function RegisterPage() {
  return (
    <PlaceholderPage title="Registrati">
      <p>Le registrazioni non sono ancora aperte.</p>
      <p>La creazione dell&apos;account sarà disponibile al lancio della piattaforma.</p>
    </PlaceholderPage>
  );
}
