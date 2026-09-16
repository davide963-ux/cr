"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { AuthFormState } from "@/app/auth/actions";
import { authFormLabels } from "@/data/content";

interface EmailPasswordFormProps {
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  submitLabel: string;
  /** "new-password" in registrazione: evita che il browser proponga la vecchia. */
  passwordAutoComplete: "current-password" | "new-password";
  passwordHint?: string;
  next?: string;
}

const field =
  "mt-1.5 h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-panel px-3.5 text-paper outline-none transition-colors placeholder:text-mist/60 focus:border-mint/60";

export function EmailPasswordForm({
  action,
  submitLabel,
  passwordAutoComplete,
  passwordHint,
  next,
}: EmailPasswordFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-paper">
          {authFormLabels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={authFormLabels.emailPlaceholder}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-paper">
          {authFormLabels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={passwordAutoComplete}
          className={field}
          aria-describedby={passwordHint ? "password-hint" : undefined}
        />
        {passwordHint ? (
          <p id="password-hint" className="mt-1.5 text-xs text-mist">
            {passwordHint}
          </p>
        ) : null}
      </div>

      {state.error ? (
        <p role="alert" className="text-sm text-loss">
          {state.error}
        </p>
      ) : null}

      {state.notice ? (
        <p role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-3 text-sm text-mist">
          {state.notice}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? authFormLabels.pending : submitLabel}
      </Button>
    </form>
  );
}
