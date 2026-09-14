import { QuoteBlock } from '@/src/types/strapi';

export function Quote({ block }: { block: QuoteBlock }) {
  return (
    <blockquote
      className="m-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-r-md px-7 py-6.5"
      style={{ borderLeft: "4px solid var(--color-accent)" }}
    >
      {block.title && (
        <div className="font-[family-name:var(--font-display)] font-bold text-xl leading-snug tracking-[-0.4px] mb-2.5">
          {block.title}
        </div>
      )}
      <p className="m-0 mb-3.5 text-[17px] leading-[1.6] text-[var(--color-body)]">{block.body}</p>
      {block.atribuicao && (
        <span className="font-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--color-faint)]">
          {block.atribuicao}
        </span>
      )}
    </blockquote>
  );
}
