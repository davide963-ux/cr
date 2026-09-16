/**
 * Osserva un elemento e invoca `onEnter` una sola volta quando entra nel viewport.
 * Restituisce la funzione di cleanup.
 */
export function observeOnce(
  el: Element,
  onEnter: () => void,
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      onEnter();
      io.disconnect();
    }
  }, options);
  io.observe(el);
  return () => io.disconnect();
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
