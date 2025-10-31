export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[var(--muted)]">
      <span className="inline-block h-2 w-2 rounded-full bg-[var(--muted)] animate-pulse" />
      <span className="inline-block h-2 w-2 rounded-full bg-[var(--muted)] animate-pulse" style={{ animationDelay: '100ms' }} />
      <span className="inline-block h-2 w-2 rounded-full bg-[var(--muted)] animate-pulse" style={{ animationDelay: '200ms' }} />
    </div>
  );
}


