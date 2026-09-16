"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketSnapshot } from "@/services/market/types";

const POLL_INTERVAL_MS = 30_000;

/**
 * Aggiorna uno snapshot di mercato interrogando /api/market a intervalli.
 * Parte dai dati già renderizzati dal server (`initial`), quindi la prima
 * schermata resta SEO/no-JS friendly; da qui in poi i prezzi si aggiornano
 * senza ricaricare la pagina. In caso di errore mantiene l'ultimo dato buono.
 */
export function useLiveMarket(initial: MarketSnapshot, intervalMs: number = POLL_INTERVAL_MS) {
  const [snapshot, setSnapshot] = useState(initial);
  const [isLive, setIsLive] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        const res = await fetch("/api/market", { signal: controller.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as MarketSnapshot;
        if (!cancelled) {
          setSnapshot(data);
          setIsLive(true);
        }
      } catch {
        // Rete assente o provider momentaneamente giù: si resta sull'ultimo dato valido.
        if (!cancelled) setIsLive(false);
      }
    };

    const id = setInterval(tick, intervalMs);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      clearInterval(id);
      controllerRef.current?.abort();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs]);

  return { snapshot, isLive };
}
