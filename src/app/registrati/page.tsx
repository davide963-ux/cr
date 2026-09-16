import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signUpAction } from "@/app/auth/actions";
import { AuthNotConfigured, AuthShell } from "@/components/auth/AuthShell";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { authErrors, registerContent } from "@/data/content";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Registrati", robots: { index: false } };

/** Dipende dalla sessione: mai prerenderizzata né messa in cache. */
export const dynamic = "force-dynamic";

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
        <EmailPasswordForm
          action={signUpAction}
          submitLabel={registerContent.button}
          passwordAutoComplete="new-password"
          passwordHint={registerContent.passwordHint}
        />
      ) : (
        <AuthNotConfigured message={authErrors.notConfigured} />
      )}
    </AuthShell>
  );
}
