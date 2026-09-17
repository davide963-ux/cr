"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const SCRIPT_SRC = "https://files.coinmarketcap.com/static/widget/currency.js";

interface CoinMarketCapWidgetProps {
  /** ID CoinMarketCap della valuta: 1 = Bitcoin. */
  currencyId: string;
  base?: string;
  className?: string;
}

/**
 * Widget CoinMarketCap: prezzo, rank, capitalizzazione e volume in tempo reale,
 * caricati dal browser del visitatore.
 *
 * A differenza degli embed TradingView, lo script è globale e cerca da sé i div
 * con classe `coinmarketcap-currency-widget`, leggendo i `data-*`: il div va
 * quindi creato prima dello script. Entrambi sono costruiti via DOM dentro un
 * container che React lascia vuoto, così il cleanup può svuotarlo senza toccare
 * nodi gestiti da React (necessario con reactStrictMode, che in sviluppo monta
 * gli effetti due volte).
 */
export function CoinMarketCapWidget({ currencyId, base = "EUR", className }: CoinMarketCapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const widget = document.createElement("div");
    widget.className = "coinmarketcap-currency-widget";
    widget.dataset.currencyid = currencyId;
    widget.dataset.base = base;
    widget.dataset.secondary = "";
    widget.dataset.ticker = "true";
    widget.dataset.rank = "true";
    widget.dataset.marketcap = "true";
    widget.dataset.volume = "true";
    widget.dataset.statsticker = "true";
    widget.dataset.stats = base;

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;

    container.append(widget, script);
    return () => container.replaceChildren();
  }, [currencyId, base]);

  return <div ref={containerRef} className={className} />;
}

/** Attribuzione alla fonte dei dati. */
export function CoinMarketCapCredit({ className }: { className?: string }) {
  return (
    <a
      href="https://coinmarketcap.com/"
      target="_blank"
      rel="noopener nofollow"
      className={cn("text-xs text-mist transition-colors hover:text-paper", className)}
    >
      Dati da CoinMarketCap
    </a>
  );
}
