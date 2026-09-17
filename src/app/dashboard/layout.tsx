import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
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
  if (!(await getAccount())) redirect("/accedi?next=/dashboard");

  return (
    <div className="min-h-dvh lg:pl-[17rem]">
      <Sidebar />
      <main id="contenuto" tabIndex={-1} className="outline-none">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </main>
    </div>
  );
}
