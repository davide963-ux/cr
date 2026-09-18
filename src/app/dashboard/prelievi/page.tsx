import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WithdrawForm } from "@/components/dashboard/WithdrawForm";
import { WithdrawalList } from "@/components/dashboard/WithdrawalList";
import { adminPage, withdrawPage } from "@/data/content";
import { formatAmount } from "@/lib/format";
import { getAccount } from "@/services/account/accountService";
import { heldTotal, listOwnWithdrawals } from "@/services/account/withdrawalService";

export const metadata: Metadata = { title: withdrawPage.title };
export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  // Il layout ha già rediretto gli anonimi: qui l'account esiste sempre.
  const account = await getAccount();
  if (!account) notFound();

  const withdrawals = account.profileReady ? await listOwnWithdrawals() : [];
  const held = heldTotal(withdrawals);

  return (
    <div className="dash-stack space-y-8">
      <DashboardHeader title={withdrawPage.title} />
      <p className="max-w-2xl text-mist">{withdrawPage.description}</p>

      {account.profileReady ? null : (
        <p role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 text-sm text-mist">
          {adminPage.migrationBody}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-mist">{withdrawPage.availableLabel}</p>
          {/*
            `balance` è già il saldo disponibile: la richiesta sottrae subito
            l'importo, quindi non c'è nulla da scalare qui.
          */}
          <p className="font-display tabular glow-mint mt-2 text-3xl">
            {formatAmount(account.balance, account.currency)}
          </p>
          <p className="mt-1 text-xs text-mist">{withdrawPage.availableHint}</p>
        </Card>
        <Card>
          <p className="text-sm text-mist">{withdrawPage.heldLabel}</p>
          <p className="font-display tabular mt-2 text-3xl text-paper">
            {formatAmount(held, account.currency)}
          </p>
          <p className="mt-1 text-xs text-mist">{withdrawPage.heldHint}</p>
        </Card>
      </div>

      <Card title={withdrawPage.formTitle}>
        <WithdrawForm available={account.balance} currency={account.currency} />
        <p className="mt-5 border-t border-line pt-4 text-xs text-mist">{withdrawPage.holdNotice}</p>
      </Card>

      <Card title={withdrawPage.listTitle}>
        <WithdrawalList entries={withdrawals} currency={account.currency} />
      </Card>
    </div>
  );
}
