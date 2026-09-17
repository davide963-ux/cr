import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PlaceholderAction } from "@/components/dashboard/PlaceholderAction";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { dashboardHome } from "@/data/content";
import { getAccount } from "@/services/account/accountService";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  // Il layout ha già rediretto gli anonimi: qui l'account esiste sempre.
  const account = await getAccount();
  if (!account) notFound();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title={dashboardHome.title}
        eyebrow={`${dashboardHome.welcome}, ${account.username}`}
      />

      <BalanceCard account={account} />

      <WalletCard
        account={account}
        title={dashboardHome.walletTitle}
        addressLabel={dashboardHome.walletAddressLabel}
        emptyLabel={dashboardHome.walletEmpty}
        action={
          <PlaceholderAction
            label={dashboardHome.deposit}
            modalTitle={dashboardHome.depositModalTitle}
            modalBody={dashboardHome.depositModalBody}
            variant="primary"
          />
        }
      />
    </div>
  );
}
