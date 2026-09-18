"use client";

import { useActionState } from "react";
import { cancelWithdrawalAction } from "@/app/dashboard/prelievi/actions";
import { Button } from "@/components/ui/Button";
import { withdrawPage } from "@/data/content";
import { formatAmount } from "@/lib/format";
import type { Withdrawal } from "@/services/account/types";
import { EmptyState } from "./Card";
import { WithdrawalStatus } from "./WithdrawalStatus";

/** Ritiro di una richiesta ancora in attesa: un modulo per riga. */
function CancelButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(cancelWithdrawalAction, {});

  return (
    <form action={formAction} className="shrink-0 text-right">
      <input type="hidden" name="withdrawal_id" value={id} />
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? withdrawPage.cancelling : withdrawPage.cancel}
      </Button>
      {state.error ? (
        <p role="alert" className="mt-1.5 text-xs text-loss">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function WithdrawalList({ entries, currency }: { entries: Withdrawal[]; currency: string }) {
  if (entries.length === 0) {
    return <EmptyState message={withdrawPage.listEmpty} icon="upload" />;
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.id}
          data-row=""
          className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="font-wide tabular text-lg font-semibold text-paper">
                  {formatAmount(entry.amount, currency)}
                </p>
                <WithdrawalStatus status={entry.status} />
              </div>
              <p className="tabular mt-1 text-xs text-mist">
                {new Date(entry.createdAt).toLocaleString("it-IT")}
              </p>
              <p className="mt-2 break-all text-sm text-mist">
                <span className="text-mist/70">{withdrawPage.columns.destination}: </span>
                {entry.destination}
              </p>
            </div>

            {entry.status === "pending" ? <CancelButton id={entry.id} /> : null}
          </div>

          {/* Il motivo del rifiuto è la parte che l'utente deve poter agire */}
          {entry.decisionReason ? (
            <p className="mt-3 rounded-[var(--radius-control)] border border-loss/25 bg-loss/[0.06] p-3 text-sm text-paper">
              <span className="text-mist">{withdrawPage.columns.reason}: </span>
              {entry.decisionReason}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
