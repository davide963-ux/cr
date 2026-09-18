"use client";

import { useActionState, useState } from "react";
import { adjustBalanceAction } from "@/app/dashboard/admin/actions";
import { Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { adminPage } from "@/data/content";
import { formatBtc } from "@/lib/format";
import { eurCentsToSats, parseAmountToCents, rateToCents, satsToBtc } from "@/lib/money";
import { useRates } from "./RatesProvider";

/**
 * Rettifica del saldo di un singolo utente.
 *
 * Tu ragioni in euro, il conto vive in satoshi. La conversione la fa il
 * database, ma il cambio glielo passa questa pagina — il server non può
 * chiederlo a CoinGecko, che rifiuta gli IP dei datacenter. L'anteprima
 * mostra quanti satoshi diventerà l'importo prima che tu confermi, perché
 * un accredito sbagliato si corregge solo con un altro movimento.
 *
 * Senza cambio i pulsanti restano spenti: meglio non poter accreditare che
 * accreditare una quantità decisa a caso.
 */
export function AdjustBalanceForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(adjustBalanceAction, {});
  const [amount, setAmount] = useState("");
  const rates = useRates();

  const rate = rates.status === "ready" ? rates.rates.eur : null;
  const cents = parseAmountToCents(amount);
  const sats = rate !== null && cents !== null && cents > 0 ? eurCentsToSats(cents, rate) : null;

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="user_id" value={userId} />
      {rate === null ? null : <input type="hidden" name="rate_eur_cents" value={rateToCents(rate)} />}

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
          onChange={(event) => setAmount(event.target.value)}
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

      {sats !== null ? (
        <p className="tabular text-xs text-mist">
          {adminPage.amountPreview.replace("{btc}", formatBtc(satsToBtc(sats)))}
        </p>
      ) : null}

      {rates.status === "failed" ? (
        <p role="alert" className="text-sm text-loss">
          {adminPage.errors.rateMissing}
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

      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="direction" value="credit" size="sm" disabled={pending || rate === null}>
          {pending ? adminPage.pending : adminPage.credit}
        </Button>
        <Button
          type="submit"
          name="direction"
          value="debit"
          variant="secondary"
          size="sm"
          disabled={pending || rate === null}
        >
          {adminPage.debit}
        </Button>
      </div>
    </form>
  );
}
