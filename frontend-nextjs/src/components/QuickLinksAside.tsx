import Link from "next/link";
import type { LinkUtil } from "@/src/types/strapi";

export function QuickLinksAside({ links }: { links: LinkUtil[] }) {
  const top = links.slice(0, 5);

  return (
    <div>
      <div className="border-b-2 border-[var(--color-ink)] pb-3 mb-4">
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl m-0" style={{ letterSpacing: "-0.5px" }}>
          Acesso rápido
        </h2>
      </div>
      {links.length === 0 && (
        <p className="text-sm text-[var(--color-muted)] m-0 mb-2">Nenhum link cadastrado no momento.</p>
      )}
      <div className="flex flex-col gap-2">
        {top.map((l, i) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[5px] px-3.5 py-3 text-[var(--color-ink)] hover:border-[var(--color-ink)]"
          >
            <span className="font-mono text-[10px] font-semibold text-[var(--color-faint-2)] flex-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-semibold min-w-0">{l.titulo}</span>
            <span className="ml-auto text-[13px]" style={{ color: "var(--color-accent)" }}>↗</span>
          </a>
        ))}
        <Link
          href="/links-uteis"
          className="no-underline mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--color-link)" }}
        >
          Todos os links →
        </Link>
      </div>
    </div>
  );
}
