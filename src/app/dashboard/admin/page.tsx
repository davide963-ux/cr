import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdjustBalanceForm } from "@/components/dashboard/AdjustBalanceForm";
import { Card, EmptyState } from "@/components/dashboard/Card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RoleToggle } from "@/components/dashboard/RoleToggle";
import { adminPage } from "@/data/content";
import { formatAmount } from "@/lib/format";
import { getAccount } from "@/services/account/accountService";
import { listRecentLedger, listUsers } from "@/services/admin/adminService";

export const metadata: Metadata = { title: adminPage.title };
export const dynamic = "force-dynamic";

/**
 * Pannello di amministrazione.
 *
 * Questo controllo nasconde la pagina; a impedire davvero le operazioni sono
 * le policy RLS e i controlli dentro le funzioni SQL, che un client non può
 * aggirare nemmeno chiamando direttamente le API di Supabase.
 */
export default async function AdminPage() {
  const account = await getAccount();
  if (!account) notFound();
  if (!account.isAdmin) notFound();

  const [users, ledger] = await Promise.all([listUsers(), listRecentLedger()]);
  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const emailById = new Map(users.map((u) => [u.id, u.email]));

  return (
    <div className="space-y-8">
      <DashboardHeader title={adminPage.title} />
      <p className="max-w-2xl text-mist">{adminPage.description}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-mist">{adminPage.totalUsers}</p>
          <p className="font-display tabular mt-2 text-3xl text-paper">{users.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-mist">{adminPage.totalBalance}</p>
          <p className="font-display tabular mt-2 text-3xl text-paper">{formatAmount(totalBalance, "EUR")}</p>
        </Card>
      </div>

      <Card title={adminPage.usersTitle}>
        {users.length === 0 ? (
          <EmptyState message={adminPage.usersEmpty} icon="user" />
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="rounded-[var(--radius-card)] border border-line bg-panel-raised p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-paper">{user.fullName ?? user.email}</p>
                    <p className="mt-0.5 break-all text-sm text-mist">{user.email}</p>
                    {user.phone || user.city ? (
                      <p className="mt-0.5 text-sm text-mist">
                        {[user.phone, user.city].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="tabular font-wide text-xl text-paper">
                      {formatAmount(user.balance, user.currency)}
                    </p>
                    <p className="mt-1 text-xs text-mist">
                      {user.isAdmin ? adminPage.roleAdmin : adminPage.roleUser}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-line pt-5">
                  <AdjustBalanceForm userId={user.id} />
                </div>

                {/* Non ci si può revocare da soli: lo impedisce anche il database. */}
                {user.id === account.id ? null : (
                  <div className="mt-4 border-t border-line pt-4">
                    <RoleToggle userId={user.id} isAdmin={user.isAdmin} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title={adminPage.ledgerTitle}>
        {ledger.length === 0 ? (
          <EmptyState message={adminPage.ledgerEmpty} icon="document" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-mist">
                  <th scope="col" className="pb-3 font-medium">{adminPage.columns.date}</th>
                  <th scope="col" className="pb-3 font-medium">{adminPage.columns.user}</th>
                  <th scope="col" className="pb-3 font-medium">{adminPage.columns.amount}</th>
                  <th scope="col" className="pb-3 font-medium">{adminPage.columns.balanceAfter}</th>
                  <th scope="col" className="pb-3 font-medium">{adminPage.columns.reason}</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry.id} className="border-b border-line last:border-0">
                    <td className="tabular py-3 text-mist">
                      {new Date(entry.createdAt).toLocaleString("it-IT")}
                    </td>
                    <td className="break-all py-3 text-mist">{emailById.get(entry.userId) ?? entry.userId}</td>
                    <td className={`tabular py-3 ${entry.amount >= 0 ? "text-mint" : "text-loss"}`}>
                      {entry.amount >= 0 ? "+" : ""}
                      {formatAmount(entry.amount, "EUR")}
                    </td>
                    <td className="tabular py-3 text-paper">{formatAmount(entry.balanceAfter, "EUR")}</td>
                    <td className="py-3 text-mist">{entry.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
