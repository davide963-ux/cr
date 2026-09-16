"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { authFormLabels, loginContent } from "@/data/content";
import { Field, FormMessages } from "./Field";

export function SignInForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signInAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <Field
        name="email"
        label={authFormLabels.email}
        type="email"
        required
        autoComplete="email"
        placeholder={authFormLabels.emailPlaceholder}
      />
      <Field
        name="password"
        label={authFormLabels.password}
        type="password"
        required
        autoComplete="current-password"
      />

      <FormMessages error={state.error} notice={state.notice} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? authFormLabels.pending : loginContent.button}
      </Button>
    </form>
  );
}
