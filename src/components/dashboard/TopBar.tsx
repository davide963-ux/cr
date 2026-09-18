"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/icons/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { dashboardHome } from "@/data/content";

const noSubscribe = () => () => {};

/**
 * Saluto in base all'ora del visitatore.
 *
 * L'ora del server non è quella di chi legge, quindi il server rende il
 * saluto neutro e il client lo sostituisce dopo l'idratazione.
 * useSyncExternalStore distingue i due lati senza scrivere stato dentro un
 * effetto, che causerebbe un render a cascata.
 */
function useGreeting(): string {
  const onClient = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  if (!onClient) return dashboardHome.greetingDefault;

  const hour = new Date().getHours();
  if (hour < 12) return dashboardHome.greetingMorning;
  if (hour < 18) return dashboardHome.greetingAfternoon;
  return dashboardHome.greetingEvening;
}

export function TopBar({ username, email }: { username: string; email: string }) {
  const greeting = useGreeting();

  return (
    <header className="flex flex-wrap items-start justify-between gap-5">
      <div className="min-w-0">
        <span className="inline-flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.07] px-3 py-1 text-xs font-medium text-mint">
          <Icon name="bolt" size={13} />
          {greeting}
        </span>
        <h1 className="font-display mt-4 text-[clamp(1.6rem,3.5vw,2.25rem)] leading-tight text-paper">
          {dashboardHome.welcome},{" "}
          <span className="text-mint">{username.toUpperCase()}</span>
        </h1>
        <p className="mt-1.5 text-mist">{dashboardHome.welcomeSubtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-panel px-3 py-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-panel-raised text-mist">
            <Icon name="user" size={15} />
          </span>
          <span className="max-w-[12rem] truncate text-sm text-paper">{email}</span>
        </div>
        <ButtonLink href="/contatti" variant="primary" size="sm">
          <Icon name="support" size={15} />
          {dashboardHome.support}
        </ButtonLink>
      </div>
    </header>
  );
}
