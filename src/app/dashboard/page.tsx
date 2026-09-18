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
import { getAccount, getOwnLedger } from "@/services/account/accountService";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  // Il layout ha già rediretto gli anonimi: qui l'account esiste sempre.
  const account = await getAccount();
  if (!account) notFound();

  const ledger = account.profileReady ? await getOwnLedger() : [];

  return (
    <div className="dash-stack space-y-8">
      <TopBar username={account.username} email={account.email} />

      {account.profileReady ? null : (
        <p role="status" className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-4 text-sm text-mist">
          {adminPage.migrationBody}
        </p>
      )}

      <StatTiles
        balanceSats={account.balanceSats}
        currency={account.currency}
        // Nessun wallet è ancora collegato: il conteggio è reale, non un segnaposto.
        walletCount={account.walletAddress ? 1 : 0}
      />

      <QuickActions />

      <BitcoinPanel currency={account.currency} />

      <FiatAccounts balanceSats={account.balanceSats} currency={account.currency} />

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
