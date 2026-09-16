"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import { authFormLabels, registerContent } from "@/data/content";
import { Field, FormMessages } from "./Field";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="first_name" label={authFormLabels.firstName} required autoComplete="given-name" maxLength={80} />
        <Field name="last_name" label={authFormLabels.lastName} required autoComplete="family-name" maxLength={80} />
      </div>

      <Field
        name="email"
        label={authFormLabels.email}
        type="email"
        required
        autoComplete="email"
        placeholder={authFormLabels.emailPlaceholder}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="phone"
          label={authFormLabels.phone}
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder={authFormLabels.phonePlaceholder}
          maxLength={25}
        />
        <Field name="city" label={authFormLabels.city} required autoComplete="address-level2" maxLength={80} />
      </div>

      <Field
        name="password"
        label={authFormLabels.password}
        type="password"
        required
        autoComplete="new-password"
        hint={registerContent.passwordHint}
      />

      <FormMessages error={state.error} notice={state.notice} />

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? authFormLabels.pending : registerContent.button}
      </Button>
    </form>
  );
}
