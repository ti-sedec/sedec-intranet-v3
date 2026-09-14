export function CoverPlaceholder({
  label,
  ratio = "16/10",
  className = "",
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center border border-[var(--color-border)] rounded-[5px] ${className}`}
      style={{
        aspectRatio: ratio,
        backgroundImage:
          "repeating-linear-gradient(135deg, #e8e4db 0 12px, #f1eee7 12px 24px)",
      }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-faint-2)] px-3 text-center">
        {label}
      </span>
    </div>
  );
}
