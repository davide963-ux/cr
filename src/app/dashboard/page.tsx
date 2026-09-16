import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { dashboardContent } from "@/data/content";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Area riservata", robots: { index: false } };

/** Dipende dalla sessione: mai prerenderizzata né messa in cache. */
export const dynamic = "force-dynamic";

/**
 * Segnaposto: serve solo come punto d'arrivo dell'accesso e come prova che la
 * sessione è valida lato server. Il proxy blocca già la rotta agli anonimi;
 * il controllo qui è la seconda serratura, quella che conta davvero.
 */
export default async function DashboardPage() {
  if (!isSupabaseConfigured()) redirect("/accedi");

  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/dashboard");

  const name = user.user_metadata?.full_name ?? user.email ?? "";

  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-20">
      <p className="text-mist">
        {dashboardContent.welcome}
        {name ? `, ${name}` : ""}.
      </p>
      <h1 className="font-display mt-3 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-paper">
        {dashboardContent.title}
      </h1>
      <p className="mt-5 max-w-xl text-lg text-mist">{dashboardContent.description}</p>

      <form action="/auth/signout" method="post" className="mt-10">
        <Button type="submit" variant="secondary">
          {dashboardContent.signOut}
        </Button>
      </form>
    </Container>
  );
}
