import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Card, DataRow, EmptyState } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PlaceholderAction } from "@/components/dashboard/PlaceholderAction";
import { profilePage } from "@/data/content";
import { formatAmount } from "@/lib/format";
import { getAccount } from "@/services/account/accountService";

export const metadata: Metadata = { title: "Profilo" };

export default async function ProfilePage() {
  const account = await getAccount();
  if (!account) notFound();

  const { fields } = profilePage;

  return (
    <div className="dash-stack space-y-8">
      <DashboardHeader
        title={profilePage.title}
        action={
          <PlaceholderAction
            label={profilePage.edit}
            modalTitle={profilePage.editModalTitle}
            modalBody={profilePage.editModalBody}
          />
        }
      />

      <Card title={profilePage.personalTitle}>
        <dl>
          <DataRow label={fields.firstName} value={account.firstName} />
          <DataRow label={fields.lastName} value={account.lastName} />
          <DataRow label={fields.phone} value={account.phone} />
          <DataRow label={fields.city} value={account.city} />
        </dl>
      </Card>

      <Card title={profilePage.accountTitle}>
        <dl>
          <DataRow label={fields.username} value={account.username || null} />
          <DataRow label={fields.email} value={account.email || null} />
          <DataRow label={fields.currency} value={account.currency} />
          <DataRow
            label={fields.declaredAmount}
            value={account.declaredAmount === null ? null : formatAmount(account.declaredAmount, account.currency)}
          />
        </dl>
      </Card>

      <Card title={profilePage.preferencesTitle}>
        <EmptyState message={profilePage.preferencesEmpty} icon="user" />
      </Card>
    </div>
  );
}
