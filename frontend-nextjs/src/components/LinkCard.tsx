import type { LinkUtil } from "@/src/types/strapi";
import { hostFromUrl } from "@/src/lib/format";

export function LinkCard({ link }: { link: LinkUtil }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-5.5 flex flex-col gap-2.5 min-w-0 hover:border-[var(--color-accent)]"
    >
      <div className="flex items-center gap-2.5">
        {link.grupo && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-faint-2)]">
            {link.grupo}
          </span>
        )}
        <span className="ml-auto text-[15px]" style={{ color: "var(--color-accent)" }}>↗</span>
      </div>
      <h3 className="font-[family-name:var(--font-display)] font-bold text-lg leading-tight tracking-[-0.4px] m-0">
        {link.titulo}
      </h3>
      {link.descricao && <p className="text-sm leading-relaxed text-[var(--color-muted)] m-0">{link.descricao}</p>}
      <span className="font-mono text-[11px] break-all" style={{ color: "var(--color-link)" }}>
        {hostFromUrl(link.url)}
      </span>
    </a>
  );
}
