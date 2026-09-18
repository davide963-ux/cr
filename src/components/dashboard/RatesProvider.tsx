"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Rates {
  /** Quanti euro/sterline/dollari vale un bitcoin. */
  eur: number;
  gbp: number;
  usd: number;
  /**
   * Variazione percentuale del prezzo negli ultimi 7 giorni, se disponibile.
   *
   * Da quando il conto è in bitcoin, è questa a muovere il controvalore che
   * l'utente vede: la somma dei movimenti del registro non basta più a
   * spiegare perché il saldo di ieri era diverso.
   */
  change7d: number | null;
}

type RateState = { status: "loading" } | { status: "ready"; rates: Rates } | { status: "failed" };

const RatesContext = createContext<RateState>({ status: "loading" });

const RATE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur,gbp,usd";
const CHANGE_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin&price_change_percentage=7d";

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
        const [res, changeRes] = await Promise.all([
          fetch(RATE_URL, { signal: controller.signal }),
          // La variazione è un di più: senza, i cambi restano validi.
          fetch(CHANGE_URL, { signal: controller.signal }).catch(() => null),
        ]);
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

        let change7d: number | null = null;
        if (changeRes?.ok) {
          const rows: unknown = await changeRes.json();
          const row = Array.isArray(rows) ? (rows[0] as Record<string, unknown> | undefined) : undefined;
          const pct = row?.price_change_percentage_7d_in_currency;
          if (typeof pct === "number" && Number.isFinite(pct)) change7d = pct;
        }

        setState({ status: "ready", rates: { eur, gbp, usd, change7d } });
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
