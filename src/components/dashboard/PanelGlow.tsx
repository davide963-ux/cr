"use client";

import { useEffect } from "react";

/**
 * Fa nascere l'alone al neon dal punto in cui si trova il puntatore.
 *
 * Un solo ascoltatore sul documento invece di uno per scheda: al passaggio
 * risale al `.panel` più vicino e gli scrive addosso --mx/--my, che il
 * gradiente in globals.css usa come centro. Le scritture sono limitate a una
 * per fotogramma, così un movimento veloce non ne accumula decine.
 *
 * Non fa nulla dove non servirebbe: su schermi touch (nessun puntatore fine) e
 * per chi ha chiesto meno movimento. In entrambi i casi il CSS ha comunque un
 * valore di ripiego, quindi il bordo si illumina lo stesso, solo centrato.
 */
export function PanelGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let pending: { panel: HTMLElement; x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const { panel, x, y } = pending;
      const box = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${x - box.left}px`);
      panel.style.setProperty("--my", `${y - box.top}px`);
      pending = null;
    };

    const onMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const panel = target.closest<HTMLElement>(".panel");
      if (!panel) return;
      pending = { panel, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
