import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footerPrompt: string;
  footerLabel: string;
  footerHref: string;
  note?: string;
  /** La registrazione ha più campi e sta meglio su una colonna più larga. */
  wide?: boolean;
}

/** Cornice condivisa dalle pagine di accesso e registrazione. */
export function AuthShell({
  title,
  description,
  children,
  footerPrompt,
  footerLabel,
  footerHref,
  note,
  wide = false,
}: AuthShellProps) {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-20">
      <div className={cn("panel w-full p-8 sm:p-10", wide ? "max-w-xl" : "max-w-md")}>
        <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-paper">{title}</h1>
        <p className="mt-3 text-mist">{description}</p>

        <div className="mt-8">{children}</div>

        {note ? <p className="mt-6 text-xs leading-relaxed text-mist">{note}</p> : null}

        <p className="mt-8 border-t border-line pt-6 text-sm text-mist">
          {footerPrompt}{" "}
          <Link href={footerHref} className="font-medium text-mint transition-opacity hover:opacity-80">
            {footerLabel}
          </Link>
        </p>
      </div>
    </Container>
  );
}

/** Mostrato finché le chiavi Supabase non sono impostate. */
export function AuthNotConfigured({ message }: { message: string }) {
  return (
    <div role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 text-sm text-mist">
      {message}
    </div>
  );
}
