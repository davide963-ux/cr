"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Rates {
  /** Quanti euro/sterline/dollari vale un bitcoin. */
  eur: number;
  gbp: number;
  usd: number;
}

type RateState = { status: "loading" } | { status: "ready"; rates: Rates } | { status: "failed" };

const RatesContext = createContext<RateState>({ status: "loading" });

const RATE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur,gbp,usd";

function readRate(source: Record<string, unknown>, key: string): number | null {
  const value = source[key];
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Cambi bitcoin, chiesti una volta sola e condivisi da tutta la pagina.
 *
 * La richiesta parte dal browser del visitatore, non dal server: CoinGecko
 * rifiuta spesso gli IP dei datacenter, Vercel compreso. Se il cambio non
 * arriva i componenti mostrano uno stato vuoto invece di un numero inventato.
 */
export function RatesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RateState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(RATE_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: unknown = await res.json();
        const bitcoin =
          typeof body === "object" && body !== null
            ? (body as Record<string, Record<string, unknown>>).bitcoin
            : undefined;

        const eur = bitcoin ? readRate(bitcoin, "eur") : null;
        const gbp = bitcoin ? readRate(bitcoin, "gbp") : null;
        const usd = bitcoin ? readRate(bitcoin, "usd") : null;
        if (eur === null || gbp === null || usd === null) throw new Error("cambi incompleti");

        setState({ status: "ready", rates: { eur, gbp, usd } });
      } catch (error) {
        if (!controller.signal.aborted) setState({ status: "failed" });
        void error;
      }
    })();

    return () => controller.abort();
  }, []);

  return <RatesContext value={state}>{children}</RatesContext>;
}

export function useRates(): RateState {
  return useContext(RatesContext);
}
