import type { Metadata } from "next";
import { Card, EmptyState } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PlaceholderAction } from "@/components/dashboard/PlaceholderAction";
import { Icon } from "@/components/icons/Icon";
import { securityPage } from "@/data/content";

export const metadata: Metadata = { title: "Sicurezza" };

export default function SecurityPage() {
  return (
    <div className="dash-stack space-y-8">
      <DashboardHeader title={securityPage.title} />

      <Card
        title={securityPage.passwordTitle}
        action={
          <PlaceholderAction
            label={securityPage.passwordButton}
            modalTitle={securityPage.passwordModalTitle}
            modalBody={securityPage.passwordModalBody}
            size="sm"
          />
        }
      >
        <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-panel-raised px-4 py-3.5">
          <Icon name="lock" size={18} className="shrink-0 text-mist/70" />
          <span className="tabular tracking-[0.2em] text-paper">{securityPage.passwordMask}</span>
        </div>
      </Card>

      <Card
        title={securityPage.twoFactorTitle}
        action={
          <PlaceholderAction
            label={securityPage.twoFactorButton}
            modalTitle={securityPage.twoFactorModalTitle}
            modalBody={securityPage.twoFactorModalBody}
            size="sm"
          />
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-panel-raised px-4 py-3.5">
          <span className="text-sm text-mist">{securityPage.twoFactorStatusLabel}</span>
          <span className="inline-flex items-center gap-2 text-[0.9375rem] text-paper">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-mist" />
            {securityPage.twoFactorStatus}
          </span>
        </div>
      </Card>

      {/* La struttura è pronta per device, browser, luogo, ultima attività e
          stato della sessione: finché non arrivano dal backend, resta vuota. */}
      <Card title={securityPage.sessionsTitle}>
        <EmptyState message={securityPage.sessionsEmpty} icon="shield" />
      </Card>
    </div>
  );
}
