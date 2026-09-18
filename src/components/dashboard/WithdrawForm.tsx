"use client";

import { useActionState } from "react";
import { requestWithdrawalAction } from "@/app/dashboard/prelievi/actions";
import { Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { withdrawPage } from "@/data/content";
import { formatAmount } from "@/lib/format";

/**
 * Modulo di richiesta.
 *
 * Il saldo disponibile è mostrato accanto al campo, ma non è una convalida:
 * quella la fa il database, che rilegge il saldo sotto lock. Fra il render di
 * questa pagina e l'invio possono passare minuti, e nel frattempo il saldo può
 * essere cambiato.
 */
export function WithdrawForm({ available, currency }: { available: number; currency: string }) {
  const [state, formAction, pending] = useActionState(requestWithdrawalAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="amount"
          label={withdrawPage.amountLabel}
          inputMode="decimal"
          required
          placeholder={withdrawPage.amountPlaceholder}
          maxLength={20}
          hint={`${withdrawPage.availableHint}: ${formatAmount(available, currency)}`}
          disabled={pending}
        />
        <Field
          name="destination"
          label={withdrawPage.destinationLabel}
          placeholder={withdrawPage.destinationPlaceholder}
          maxLength={200}
          autoComplete="off"
          spellCheck={false}
          hint={withdrawPage.destinationHint}
          disabled={pending}
        />
      </div>

      <Field
        name="note"
        label={withdrawPage.noteLabel}
        placeholder={withdrawPage.notePlaceholder}
        maxLength={500}
        disabled={pending}
      />

      {state.error ? (
        <p role="alert" className="text-sm text-loss">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-sm text-mint">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || available <= 0}>
        {pending ? withdrawPage.pending : withdrawPage.submit}
      </Button>
    </form>
  );
}
