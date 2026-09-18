"use client";

import { useActionState } from "react";
import { decideWithdrawalAction } from "@/app/dashboard/admin/actions";
import { Button } from "@/components/ui/Button";
import { adminPage, withdrawPage } from "@/data/content";
import { formatAmount } from "@/lib/format";
import type { AdminWithdrawal } from "@/services/account/types";
import { WithdrawalStatus } from "./WithdrawalStatus";

const control =
  "mt-1.5 min-h-[4.5rem] w-full rounded-[var(--radius-control)] border border-line-strong bg-panel px-3.5 py-2.5 text-paper outline-none transition-colors placeholder:text-mist/60 focus:border-mint/60";

/**
 * Una richiesta in coda, con i due pulsanti di decisione.
 *
 * Entrambi inviano lo stesso modulo e si distinguono per il `value` del
 * pulsante premuto, così il motivo scritto viaggia con qualunque scelta. Il
 * campo è `required` solo nella funzione SQL, che rifiuta un diniego senza
 * motivo: se lo rendessimo obbligatorio anche in HTML, bloccherebbe pure
 * l'approvazione, dove non serve.
 */
export function WithdrawalReview({ withdrawal }: { withdrawal: AdminWithdrawal }) {
  const [state, formAction, pending] = useActionState(decideWithdrawalAction, {});
  const fieldId = `decision-${withdrawal.id}`;

  return (
    <li data-row="" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-paper">{withdrawal.userName ?? withdrawal.userEmail}</p>
          <p className="mt-0.5 break-all text-sm text-mist">{withdrawal.userEmail}</p>
          <p className="tabular mt-1 text-xs text-mist">
            {new Date(withdrawal.createdAt).toLocaleString("it-IT")}
          </p>
        </div>
        <div className="text-right">
          <p className="font-wide tabular text-xl text-paper">{formatAmount(withdrawal.amount, "EUR")}</p>
          <div className="mt-1.5 flex justify-end">
            <WithdrawalStatus status={withdrawal.status} />
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-mist">{adminPage.withdrawalDestination}:</dt>
          <dd className="break-all text-paper">
            {withdrawal.destination ?? withdrawPage.destinationMissing}
          </dd>
        </div>
        {withdrawal.note ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-mist">{adminPage.withdrawalNote}:</dt>
            <dd className="text-paper">{withdrawal.note}</dd>
          </div>
        ) : null}
      </dl>

      {/*
        Una richiesta senza destinazione non dice dove mandare il denaro:
        va detto prima dei pulsanti, non nascosto in una riga di dettaglio.
      */}
      {withdrawal.destination ? null : (
        <p className="mt-3 rounded-[var(--radius-control)] border border-[#E9A24B]/30 bg-[#E9A24B]/[0.08] p-3 text-sm text-[#E9A24B]">
          {adminPage.withdrawalDestinationMissing}
        </p>
      )}

      <form action={formAction} className="mt-4 space-y-3 border-t border-line pt-4">
        <input type="hidden" name="withdrawal_id" value={withdrawal.id} />

        <div>
          <label htmlFor={fieldId} className="text-sm font-medium text-paper">
            {adminPage.decisionLabel}
          </label>
          <textarea
            id={fieldId}
            name="decision"
            maxLength={500}
            rows={2}
            disabled={pending}
            placeholder={adminPage.decisionPlaceholder}
            aria-describedby={`${fieldId}-hint`}
            className={control}
          />
          <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-mist">
            {adminPage.decisionHint}
          </p>
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
          <Button type="submit" name="decision_kind" value="approve" size="sm" disabled={pending}>
            {pending ? adminPage.approving : adminPage.approve}
          </Button>
          <Button
            type="submit"
            name="decision_kind"
            value="reject"
            variant="secondary"
            size="sm"
            disabled={pending}
          >
            {adminPage.reject}
          </Button>
        </div>
      </form>
    </li>
  );
}

/** Richieste già evase: sola lettura, con l'esito accanto. */
export function WithdrawalRecord({ withdrawal }: { withdrawal: AdminWithdrawal }) {
  return (
    <li data-row="" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-all text-sm text-paper">{withdrawal.userEmail}</p>
          <p className="tabular mt-0.5 text-xs text-mist">
            {new Date(withdrawal.decidedAt ?? withdrawal.createdAt).toLocaleString("it-IT")}
          </p>
          <p className="mt-1.5 break-all text-sm text-mist">
            <span className="text-mist/70">{withdrawPage.columns.destination}: </span>
            {withdrawal.destination ?? withdrawPage.destinationMissing}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-wide tabular text-paper">{formatAmount(withdrawal.amount, "EUR")}</span>
          <WithdrawalStatus status={withdrawal.status} />
        </div>
      </div>
      {withdrawal.decisionReason ? (
        <p className="mt-3 text-sm text-mist">
          <span className="text-mist/70">{withdrawPage.columns.reason}: </span>
          {withdrawal.decisionReason}
        </p>
      ) : null}
    </li>
  );
}
