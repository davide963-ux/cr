"use client";

import { useActionState, useState } from "react";
import { requestWithdrawalAction } from "@/app/dashboard/prelievi/actions";
import { Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { withdrawPage } from "@/data/content";
import { formatBtc } from "@/lib/format";
import { eurCentsToSats, parseAmountToCents, rateToCents, satsToBtc } from "@/lib/money";
import { Money, Btc } from "./Money";
import { useRates } from "./RatesProvider";

/**
 * Modulo di richiesta.
 *
 * Quello che viene trattenuto è una quantità di bitcoin, non un importo in
 * euro: l'utente scrive euro perché è così che pensa, ma prima di inviare
 * vede quanti BTC sta chiedendo, perché è quella la cifra che riceverà.
 * Scoprirlo dopo sarebbe una sorpresa sul denaro.
 *
 * Il cambio viaggia col modulo in un campo nascosto: il server non può
 * chiederlo a CoinGecko, che rifiuta gli IP dei datacenter. Non viene creduto
 * sulla parola — la funzione SQL ne verifica la plausibilità e rifà da sé la
 * moltiplicazione. Senza cambio non si invia: convertire a occhio un importo
 * di denaro non è un'opzione.
 */
export function WithdrawForm({
  availableSats,
  currency,
}: {
  availableSats: number;
  currency: string;
}) {
  const [state, formAction, pending] = useActionState(requestWithdrawalAction, {});
  const [amount, setAmount] = useState("");
  const rates = useRates();

  const rate = rates.status === "ready" ? rates.rates.eur : null;
  const cents = parseAmountToCents(amount);
  const sats = rate !== null && cents !== null && cents > 0 ? eurCentsToSats(cents, rate) : null;
  const blocked = rate === null || availableSats <= 0;

  return (
    <form action={formAction} className="space-y-4">
      {rate === null ? null : <input type="hidden" name="rate_eur_cents" value={rateToCents(rate)} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="amount"
          label={withdrawPage.amountLabel}
          inputMode="decimal"
          required
          placeholder={withdrawPage.amountPlaceholder}
          maxLength={20}
          onChange={(event) => setAmount(event.target.value)}
          hint={withdrawPage.amountHint}
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

      {/* Cosa riceverà davvero, prima di premere e non dopo */}
      {sats !== null ? (
        <p className="rounded-[var(--radius-control)] border border-mint/25 bg-mint/[0.06] p-3 text-sm text-paper">
          {withdrawPage.amountConverted.replace("{btc}", formatBtc(satsToBtc(sats)))}
        </p>
      ) : null}

      <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-mist">
        <span>{withdrawPage.availableHint}:</span>
        <Money sats={availableSats} currency={currency} className="tabular text-paper" />
        <Btc sats={availableSats} className="tabular" />
      </div>

      {rates.status === "failed" ? (
        <p role="alert" className="text-sm text-loss">
          {withdrawPage.rateUnavailable}
        </p>
      ) : null}
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

      <Button type="submit" disabled={pending || blocked}>
        {pending ? withdrawPage.pending : withdrawPage.submit}
      </Button>
    </form>
  );
}
