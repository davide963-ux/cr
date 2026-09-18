import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, DataRow } from "@/components/dashboard/Card";
import { Money } from "@/components/dashboard/Money";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PlaceholderAction } from "@/components/dashboard/PlaceholderAction";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { walletPage } from "@/data/content";
import { getAccount } from "@/services/account/accountService";

export const metadata: Metadata = { title: "Portafoglio" };

export default async function PortfolioPage() {
  const account = await getAccount();
  if (!account) notFound();

  return (
    <div className="dash-stack space-y-8">
      <DashboardHeader title={walletPage.title} />

      {/* Stessi dati della dashboard: entrambe leggono da getAccount() */}
      <Card>
        <dl>
          <DataRow label={walletPage.usernameLabel} value={account.username || null} />
          <DataRow label={walletPage.balanceLabel} value={<Money sats={account.balanceSats} currency={account.currency} />} />
        </dl>
      </Card>

      <WalletCard
        account={account}
        title={walletPage.manageTitle}
        addressLabel={walletPage.addressLabel}
        emptyLabel={walletPage.addressEmpty}
        note={walletPage.exportNote}
        action={
          <PlaceholderAction
            label={walletPage.exportKey}
            modalTitle={walletPage.exportModalTitle}
            modalBody={walletPage.exportModalBody}
          />
        }
      />
    </div>
  );
}
