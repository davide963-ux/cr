"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface TradingViewWidgetProps {
  /** Nome dell'embed TradingView, es. "mini-symbol-overview". */
  widget: string;
  /** Configurazione nel formato TradingView (lo snippet ufficiale del widget). */
  config: Record<string, unknown>;
  className?: string;
}

const EMBED_BASE = "https://s3.tradingview.com/external-embedding/embed-widget-";

/**
 * Monta un widget TradingView: le quotazioni arrivano direttamente dal browser
 * del visitatore, quindi nessuna API key, nessun rate limit e nessuna chiamata
 * dal server che possa fallire.
 *
 * Lo <script> va creato via DOM e non reso da React: React non esegue gli script
 * resi come figli, e l'embed legge la propria configurazione dal contenuto
 * testuale del tag. Il container resta vuoto lato React, così il cleanup può
 * svuotarlo senza toccare nodi gestiti da React (necessario con reactStrictMode,
 * che in sviluppo monta gli effetti due volte).
 */
export function TradingViewWidget({ widget, config, className }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const serializedConfig = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const host = document.createElement("div");
    host.className = "tradingview-widget-container__widget";

    const script = document.createElement("script");
    script.src = `${EMBED_BASE}${widget}.js`;
    script.async = true;
    script.textContent = serializedConfig;

    container.append(host, script);
    return () => container.replaceChildren();
  }, [widget, serializedConfig]);

  return <div ref={containerRef} className={cn("tradingview-widget-container", className)} />;
}

/** Attribuzione richiesta dai termini d'uso dei widget TradingView. */
export function TradingViewCredit({ className }: { className?: string }) {
  return (
    <a
      href="https://www.tradingview.com/"
      target="_blank"
      rel="noopener nofollow"
      className={cn("text-xs text-mist transition-colors hover:text-paper", className)}
    >
      Quotazioni fornite da TradingView
    </a>
  );
}
