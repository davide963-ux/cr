"use client";

import { dashboardHome } from "@/data/content";
import { formatAmount } from "@/lib/format";
import { useRates, type Rates } from "./RatesProvider";
import { Shimmer } from "./Shimmer";

const CURRENCIES = [
  { code: "EUR", key: "eur", name: dashboardHome.fiat.eur, symbol: "€", tint: "#9AA8E8" },
  { code: "GBP", key: "gbp", name: dashboardHome.fiat.gbp, symbol: "£", tint: "#67e3ae" },
  { code: "USD", key: "usd", name: dashboardHome.fiat.usd, symbol: "$", tint: "#E8C24A" },
] as const satisfies readonly { code: string; key: keyof Rates; name: string; symbol: string; tint: string }[];

/**
 * Il saldo espresso nelle tre valute.
 *
 * La conversione passa dal bitcoin, perché è l'unico cambio che abbiamo:
 * saldo in euro → bitcoin → valuta di destinazione. Senza i cambi le cifre
 * non vengono mostrate: meglio un trattino che un importo sbagliato.
 */
export function FiatAccounts({ balance, currency }: { balance: number; currency: string }) {
  const rates = useRates();
  const btc = rates.status === "ready" ? balance / rates.rates.eur : null;

  return (
    <section>
      <h2 className="font-wide text-base font-semibold text-paper">{dashboardHome.fiatTitle}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {CURRENCIES.map((item) => {
          const rate = rates.status === "ready" ? rates.rates[item.key] : null;
          const converted = btc !== null && rate !== null ? btc * rate : null;

          return (
            <article
              key={item.code}
              className="panel group p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-card)] text-[0.9375rem] font-semibold transition-transform duration-300 ease-[var(--ease-ui)] group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(150deg, ${item.tint}30, ${item.tint}0d)`,
                    boxShadow: `inset 0 1px 0 rgb(255 255 255 / 0.07), 0 0 0 1px ${item.tint}26, 0 8px 18px -10px ${item.tint}80`,
                    color: item.tint,
                  }}
                  aria-hidden="true"
                >
                  {item.symbol}
                </span>
                <div>
                  <p className="font-medium leading-tight text-paper">{item.name}</p>
                  <p className="text-sm text-mist">{item.code}</p>
                </div>
              </div>

              <p className="font-wide tabular mt-5 text-2xl font-semibold text-paper">
                {converted !== null ? (
                  formatAmount(converted, item.code)
                ) : rates.status === "loading" ? (
                  <Shimmer label={dashboardHome.ratesLoading} className="h-7 w-32 align-middle" />
                ) : (
                  "—"
                )}
              </p>
              <p className="mt-1 text-xs text-mist">
                {rate === null
                  ? rates.status === "loading"
                    ? dashboardHome.ratesLoading
                    : dashboardHome.ratesUnavailable
                  : `1 BTC = ${formatAmount(rate, item.code)}`}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-mist">
        {dashboardHome.fiatNote.replace("{currency}", currency)}
      </p>
    </section>
  );
}
