import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthNotConfigured, AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { authErrors, registerContent } from "@/data/content";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Registrati", robots: { index: false } };

/** Dipende dalla sessione: mai prerenderizzata né messa in cache. */
export const dynamic = "force-dynamic";

/**
 * Con il solo accesso Google, registrarsi e accedere sono la stessa azione:
 * al primo ingresso Supabase crea l'utente. Le due pagine restano separate
 * perché cambiano i link che ci portano e il testo che l'utente si aspetta.
 */
export default async function RegisterPage() {
  if (isSupabaseConfigured() && (await getCurrentUser())) {
    redirect(AFTER_LOGIN_PATH);
  }

  return (
    <AuthShell
      title={registerContent.title}
      description={registerContent.description}
      footerPrompt={registerContent.switchPrompt}
      footerLabel={registerContent.switchLink}
      footerHref="/accedi"
      note={registerContent.legalNote}
    >
      {isSupabaseConfigured() ? (
        <GoogleSignInButton label={registerContent.button} />
      ) : (
        <AuthNotConfigured message={authErrors.notConfigured} />
      )}
    </AuthShell>
  );
}
