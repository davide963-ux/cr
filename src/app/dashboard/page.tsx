import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BitcoinPanel } from "@/components/dashboard/BitcoinPanel";
import { FiatAccounts } from "@/components/dashboard/FiatAccounts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatTiles } from "@/components/dashboard/StatTiles";
import { TopBar } from "@/components/dashboard/TopBar";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { adminPage, dashboardHome } from "@/data/content";
import { getAccount, getOwnLedger, getWeeklyChange } from "@/services/account/accountService";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  // Il layout ha già rediretto gli anonimi: qui l'account esiste sempre.
  const account = await getAccount();
  if (!account) notFound();

  const [ledger, weekly] = account.profileReady
    ? await Promise.all([getOwnLedger(), getWeeklyChange(account.balance)])
    : [[], null];

  return (
    <div className="space-y-8">
      <TopBar username={account.username} email={account.email} />

      {account.profileReady ? null : (
        <p role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 text-sm text-mist">
          {adminPage.migrationBody}
        </p>
      )}

      <StatTiles
        balance={account.balance}
        currency={account.currency}
        // Nessun wallet è ancora collegato: il conteggio è reale, non un segnaposto.
        walletCount={account.walletAddress ? 1 : 0}
        weekly={weekly}
      />

      <QuickActions />

      <BitcoinPanel />

      <FiatAccounts balance={account.balance} currency={account.currency} />

      <WalletCard
        account={account}
        title={dashboardHome.walletTitle}
        addressLabel={dashboardHome.walletAddressLabel}
        emptyLabel={dashboardHome.walletEmpty}
        action={null}
      />

      <TransactionHistory entries={ledger} currency={account.currency} />
    </div>
  );
}
