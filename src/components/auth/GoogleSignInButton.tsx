"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { AFTER_LOGIN_PATH } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Logo Google ufficiale, usato solo per identificare il metodo di accesso. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export function GoogleSignInButton({ label, next }: { label: string; next?: string }) {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  async function signIn() {
    setPending(true);
    setFailed(false);
    try {
      const supabase = createSupabaseBrowserClient();
      const target = next?.startsWith("/") && !next.startsWith("//") ? next : AFTER_LOGIN_PATH;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}` },
      });
      // Se l'avvio riesce il browser lascia la pagina: si torna qui solo in caso d'errore.
      if (error) throw error;
    } catch {
      setFailed(true);
      setPending(false);
    }
  }

  return (
    <div>
      <Button variant="secondary" size="lg" onClick={signIn} disabled={pending} className="w-full sm:w-auto">
        <GoogleMark />
        {pending ? "Reindirizzamento…" : label}
      </Button>
      {failed ? (
        <p role="alert" className="mt-3 text-sm text-loss">
          Non è stato possibile avviare l&apos;accesso. Riprova tra qualche istante.
        </p>
      ) : null}
    </div>
  );
}
