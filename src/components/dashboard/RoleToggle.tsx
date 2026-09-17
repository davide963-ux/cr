"use client";

import { useActionState } from "react";
import { setAdminAction } from "@/app/dashboard/admin/actions";
import { Button } from "@/components/ui/Button";
import { adminPage } from "@/data/content";

/** Promuove o revoca un amministratore. Il database rifiuta l'auto-revoca. */
export function RoleToggle({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const [state, formAction, pending] = useActionState(setAdminAction, {});

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="make_admin" value={isAdmin ? "false" : "true"} />

      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? adminPage.pending : isAdmin ? adminPage.demote : adminPage.promote}
      </Button>

      {state.error ? (
        <span role="alert" className="text-sm text-loss">
          {state.error}
        </span>
      ) : null}
      {state.success ? (
        <span role="status" className="text-sm text-mint">
          {state.success}
        </span>
      ) : null}
    </form>
  );
}
