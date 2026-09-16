import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { authFormLabels, dashboardContent } from "@/data/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";

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

  const meta = user.user_metadata ?? {};
  const name = typeof meta.full_name === "string" ? meta.full_name : (user.email ?? "");

  const details = [
    { label: authFormLabels.firstName, value: meta.first_name },
    { label: authFormLabels.lastName, value: meta.last_name },
    { label: authFormLabels.email, value: user.email },
    { label: authFormLabels.phone, value: meta.phone },
    { label: authFormLabels.city, value: meta.city },
  ].filter((d): d is { label: string; value: string } => typeof d.value === "string" && d.value.length > 0);

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

      <dl className="mt-10 grid max-w-2xl gap-px overflow-hidden rounded-[var(--radius-panel)] border border-line bg-line sm:grid-cols-2">
        {details.map((d) => (
          <div key={d.label} className="bg-panel p-4">
            <dt className="text-xs text-mist">{d.label}</dt>
            <dd className="mt-1 break-words text-[0.9375rem] text-paper">{d.value}</dd>
          </div>
        ))}
      </dl>

      <form action="/auth/signout" method="post" className="mt-10">
        <Button type="submit" variant="secondary">
          {dashboardContent.signOut}
        </Button>
      </form>
    </Container>
  );
}
