"use client";

import { useActionState } from "react";
import { adjustBalanceAction } from "@/app/dashboard/admin/actions";
import { Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { adminPage } from "@/data/content";

/** Rettifica del saldo di un singolo utente: importo, verso e motivo. */
export function AdjustBalanceForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(adjustBalanceAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="user_id" value={userId} />

      <div className="grid gap-3 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
        {/* Un modulo per riga della tabella: l'id resta unico, il name no. */}
        <Field
          name="amount"
          id={`amount-${userId}`}
          label={adminPage.amountLabel}
          inputMode="decimal"
          required
          placeholder={adminPage.amountPlaceholder}
          maxLength={20}
        />
        <Field
          name="reason"
          id={`reason-${userId}`}
          label={adminPage.reasonLabel}
          required
          placeholder={adminPage.reasonPlaceholder}
          maxLength={500}
        />
      </div>

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

      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="direction" value="credit" size="sm" disabled={pending}>
          {pending ? adminPage.pending : adminPage.credit}
        </Button>
        <Button type="submit" name="direction" value="debit" variant="secondary" size="sm" disabled={pending}>
          {adminPage.debit}
        </Button>
      </div>
    </form>
  );
}
