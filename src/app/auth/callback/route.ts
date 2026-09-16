import { NextResponse, type NextRequest } from "next/server";
import { AFTER_LOGIN_PATH, isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Ritorno dal link di conferma dell'email: Supabase rimanda qui con un `code`
 * monouso, che viene scambiato per una sessione salvata in cookie httpOnly.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  // Solo percorsi interni: evita redirect verso domini esterni
  const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : AFTER_LOGIN_PATH;

  if (!isSupabaseConfigured() || !code) {
    return NextResponse.redirect(`${origin}/accedi?errore=callback`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/accedi?errore=callback`);
  }

  return NextResponse.redirect(`${origin}${redirectTo}`);
}
