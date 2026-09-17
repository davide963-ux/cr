"use client";

import { useEffect, useState } from "react";
import { dashboardHome } from "@/data/content";
import { formatAmount, formatBtc } from "@/lib/format";

const RATE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur";

type Rate = { status: "loading" } | { status: "ready"; eurPerBtc: number } | { status: "failed" };

/**
 * Controvalore in bitcoin del saldo.
 *
 * Il cambio si chiede dal browser del visitatore, non dal server: CoinGecko
 * rifiuta spesso le richieste dagli IP dei datacenter (Vercel compreso), come
 * già visto con le quotazioni della homepage.
 *
 * Se il cambio non arriva la conversione non viene mostrata: su un saldo
 * un numero sbagliato è peggio di un numero assente.
 */
export function BtcEquivalent({ balance, currency }: { balance: number; currency: string }) {
  const [rate, setRate] = useState<Rate>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(RATE_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: unknown = await res.json();
        const value =
          typeof body === "object" && body !== null
            ? (body as Record<string, Record<string, unknown>>).bitcoin?.eur
            : undefined;
        if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
          throw new Error("cambio non valido");
        }
        setRate({ status: "ready", eurPerBtc: value });
      } catch (error) {
        if (!controller.signal.aborted) setRate({ status: "failed" });
        void error;
      }
    })();

    return () => controller.abort();
  }, []);

  if (rate.status === "loading") {
    return <p className="mt-3 text-sm text-mist">{dashboardHome.btcLoading}</p>;
  }

  if (rate.status === "failed") {
    return <p className="mt-3 text-sm text-mist">{dashboardHome.btcUnavailable}</p>;
  }

  return (
    <div className="mt-3">
      <p className="tabular text-lg text-paper">≈ {formatBtc(balance / rate.eurPerBtc)}</p>
      <p className="mt-1 text-xs text-mist">
        {dashboardHome.btcRate.replace("{rate}", formatAmount(rate.eurPerBtc, currency))}
      </p>
    </div>
  );
}
