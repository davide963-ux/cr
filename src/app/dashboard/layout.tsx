import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { adminPage, dashboardNav } from "@/data/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAccount } from "@/services/account/accountService";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Ogni pagina dell'area riservata dipende dalla sessione. */
export const dynamic = "force-dynamic";

/**
 * Cornice dell'area riservata: sidebar fissa da lg in su, drawer sotto.
 * Il proxy blocca già /dashboard agli anonimi; il controllo qui è la seconda
 * serratura, quella che conta davvero perché verifica la sessione col server.
 */
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/accedi");
  const account = await getAccount();
  if (!account) redirect("/accedi?next=/dashboard");

  // La voce compare solo agli amministratori; il permesso vero però sta nel
  // database, quindi nasconderla non è la misura di sicurezza, solo l'ordine.
  const items = account.isAdmin
    ? [...dashboardNav, { label: adminPage.navLabel, href: "/dashboard/admin", icon: "lock" as const }]
    : dashboardNav;

  return (
    <div className="min-h-dvh lg:pl-[17rem]">
      <Sidebar items={items} />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
