export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <span className="size-8 animate-spin rounded-full border-2 border-line-strong border-t-mint" />
      <span className="sr-only">Caricamento…</span>
    </div>
  );
}
