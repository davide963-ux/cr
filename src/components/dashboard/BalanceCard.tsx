import { adminPage, dashboardHome } from "@/data/content";
import { formatAmount } from "@/lib/format";
import type { AccountUser } from "@/services/account/types";
import { BtcEquivalent } from "./BtcEquivalent";

/**
 * Saldo del conto. Il valore arriva dall'oggetto account, mai scritto a mano:
 * quando ci sarà un backend basterà cambiare accountService.
 */
export function BalanceCard({ account }: { account: AccountUser }) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
        <div>
          <p className="text-sm text-mist">{dashboardHome.balanceLabel}</p>
          <p className="font-display tabular mt-3 text-[clamp(2.5rem,6vw,3.75rem)] leading-none text-paper">
            {formatAmount(account.balance, account.currency)}
          </p>
          {account.profileReady ? (
            <BtcEquivalent balance={account.balance} currency={account.currency} />
          ) : null}
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-panel-raised px-4 py-3">
          <p className="text-xs text-mist">{dashboardHome.currencyLabel}</p>
          <p className="font-wide mt-0.5 text-[0.9375rem] font-medium text-paper">{account.currency}</p>
        </div>
      </div>
      <p className="border-t border-line px-6 py-4 text-xs text-mist sm:px-8">
        {account.profileReady ? dashboardHome.balanceNote : adminPage.migrationBody}
      </p>
    </section>
  );
}
