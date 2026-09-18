import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WithdrawForm } from "@/components/dashboard/WithdrawForm";
import { WithdrawalList } from "@/components/dashboard/WithdrawalList";
import { Money, Btc } from "@/components/dashboard/Money";
import { adminPage, withdrawPage } from "@/data/content";
import { getAccount } from "@/services/account/accountService";
import { heldTotal, listOwnWithdrawals } from "@/services/account/withdrawalService";

export const metadata: Metadata = { title: withdrawPage.title };
export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  // Il layout ha già rediretto gli anonimi: qui l'account esiste sempre.
  const account = await getAccount();
  if (!account) notFound();

  // null = la tabella non c'è. Diverso da [] ("nessuna richiesta"): il primo
  // è un problema di installazione da dire subito, il secondo è normale.
  const withdrawals = account.profileReady ? await listOwnWithdrawals() : [];
  const ready = withdrawals !== null;
  const entries = withdrawals ?? [];
  const held = heldTotal(entries);

  return (
    <div className="dash-stack space-y-8">
      <DashboardHeader title={withdrawPage.title} />
      <p className="max-w-2xl text-mist">{withdrawPage.description}</p>

      {account.profileReady ? null : (
        <p role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 text-sm text-mist">
          {adminPage.migrationBody}
        </p>
      )}

      {ready ? null : (
        <div
          role="status"
          className="rounded-[var(--radius-card)] border border-[#E9A24B]/30 bg-[#E9A24B]/[0.08] p-4 text-sm text-[#E9A24B]"
        >
          <p className="font-medium">{withdrawPage.migrationTitle}</p>
          <p className="mt-1 text-[#E9A24B]/85">{withdrawPage.migrationBody}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-mist">{withdrawPage.availableLabel}</p>
          {/*
            `balance` è già il saldo disponibile: la richiesta sottrae subito
            l'importo, quindi non c'è nulla da scalare qui.
          */}
          <Money
            sats={account.balanceSats}
            currency={account.currency}
            className="font-display tabular glow-mint mt-2 block text-3xl"
          />
          <Btc sats={account.balanceSats} className="mt-1 block text-xs text-mist" />
          <p className="mt-1 text-xs text-mist">{withdrawPage.availableHint}</p>
        </Card>
        <Card>
          <p className="text-sm text-mist">{withdrawPage.heldLabel}</p>
          <Money sats={held} currency={account.currency} className="font-display tabular mt-2 block text-3xl text-paper" />
          <Btc sats={held} className="mt-1 block text-xs text-mist" />
          <p className="mt-1 text-xs text-mist">{withdrawPage.heldHint}</p>
        </Card>
      </div>

      <Card title={withdrawPage.formTitle}>
        {/* Modulo disabilitato finché la tabella non esiste: premerlo darebbe
            solo un errore, e chiederlo due volte non lo farebbe funzionare. */}
        <WithdrawForm availableSats={ready ? account.balanceSats : 0} currency={account.currency} />
        <p className="mt-5 border-t border-line pt-4 text-xs text-mist">{withdrawPage.holdNotice}</p>
      </Card>

      <Card title={withdrawPage.listTitle}>
        <WithdrawalList entries={entries} currency={account.currency} />
      </Card>
    </div>
  );
}
