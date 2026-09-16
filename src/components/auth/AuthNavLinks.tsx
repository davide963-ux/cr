"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { authLinks, dashboardContent } from "@/data/content";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/cn";

/**
 * Stato di autenticazione letto nel browser, così le pagine pubbliche
 * restano statiche. Finché non si sa, si mostrano i pulsanti da anonimo:
 * è quello che contiene anche l'HTML statico, quindi niente hydration mismatch.
 */
function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return user;
}

interface AuthNavLinksProps {
  size: "sm" | "lg";
  onNavigate?: () => void;
  className?: string;
}

export function AuthNavLinks({ size, onNavigate, className }: AuthNavLinksProps) {
  const user = useAuthUser();
  const full = size === "lg";

  if (user) {
    return (
      <div className={cn(full ? "grid grid-cols-2 gap-3" : "flex items-center gap-2", className)}>
        <ButtonLink href={AFTER_LOGIN_PATH} variant="secondary" size={size} onClick={onNavigate}>
          {dashboardContent.title}
        </ButtonLink>
        <form action="/auth/signout" method="post" className={full ? "contents" : undefined}>
          <Button type="submit" variant={full ? "primary" : "ghost"} size={size} className={full ? "w-full" : undefined}>
            {dashboardContent.signOut}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={cn(full ? "grid grid-cols-2 gap-3" : "flex items-center gap-2", className)}>
      <ButtonLink href={authLinks.login.href} variant={full ? "secondary" : "ghost"} size={size} onClick={onNavigate}>
        {authLinks.login.label}
      </ButtonLink>
      <ButtonLink href={authLinks.register.href} variant="primary" size={size} onClick={onNavigate}>
        {authLinks.register.label}
      </ButtonLink>
    </div>
  );
}
