export default function Loading() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-charcoal/15 border-t-accent" />
        <span className="text-xs uppercase tracking-[0.3em] text-charcoal/40">Loading</span>
      </div>
    </div>
  );
}
