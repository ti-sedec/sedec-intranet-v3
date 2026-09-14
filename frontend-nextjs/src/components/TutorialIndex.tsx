import type { HeadingItem } from "@/src/lib/format";

export function TutorialIndex({ items }: { items: HeadingItem[] }) {
  if (items.length === 0) return null;

  return (
    <aside className="flex-[1_1_220px] min-w-0 lg:sticky lg:top-[110px]">
      <div className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-faint-2)] pb-2.5 border-b border-[var(--color-border-strong)] mb-3">
        Neste tutorial
      </div>
      <ol className="m-0 p-0 list-none flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.n} className="flex gap-2.5 text-sm leading-tight text-[var(--color-ink-soft)]">
            <span className="font-mono text-[11px] flex-none pt-0.5" style={{ color: "var(--color-accent-strong)" }}>
              {item.n}
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
