export function PageHeading({
  kicker,
  title,
  dek,
}: {
  kicker: string;
  title: string;
  dek?: string;
}) {
  return (
    <div>
      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--color-faint)]">
        {kicker}
      </span>
      <h1
        className="font-[family-name:var(--font-display)] font-extrabold m-0 mt-2 mb-1.5"
        style={{ fontSize: "clamp(30px, 4.4vw, 52px)", letterSpacing: "-1.4px", lineHeight: 1 }}
      >
        {title}
      </h1>
      {dek && <p className="text-[17px] text-[var(--color-muted)] max-w-[60ch] mt-0 mb-7">{dek}</p>}
    </div>
  );
}
