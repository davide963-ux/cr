import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/auth/actions";
import { AuthNotConfigured, AuthShell } from "@/components/auth/AuthShell";
import { EmailPasswordForm } from "@/components/auth/EmailPasswordForm";
import { authErrors, loginContent } from "@/data/content";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Accedi", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; errore?: string }>;
}) {
  const { next, errore } = await searchParams;

  if (isSupabaseConfigured() && (await getCurrentUser())) {
    redirect(AFTER_LOGIN_PATH);
  }

  return (
    <AuthShell
      title={loginContent.title}
      description={loginContent.description}
      footerPrompt={loginContent.switchPrompt}
      footerLabel={loginContent.switchLink}
      footerHref="/registrati"
    >
      {errore ? (
        <p role="alert" className="mb-4 text-sm text-loss">
          {authErrors.callback}
        </p>
      ) : null}

      {isSupabaseConfigured() ? (
        <EmailPasswordForm
          action={signInAction}
          submitLabel={loginContent.button}
          passwordAutoComplete="current-password"
          next={next}
        />
      ) : (
        <AuthNotConfigured message={authErrors.notConfigured} />
      )}
    </AuthShell>
  );
}
