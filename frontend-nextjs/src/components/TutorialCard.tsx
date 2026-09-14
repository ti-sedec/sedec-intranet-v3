import Link from "next/link";
import type { Tutorial } from "@/src/types/strapi";
import { readingTime, stepsCount } from "@/src/lib/format";

export function TutorialCard({ tutorial, index }: { tutorial: Tutorial; index: number }) {
  return (
    <Link
      href={`/tutoriais/${tutorial.slug}`}
      className="no-underline text-inherit block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-6 flex flex-col gap-3 min-w-0 hover:border-[var(--color-ink)]"
    >
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] font-semibold text-white bg-[var(--color-ink)] rounded-[3px] px-1.5 py-1">
          {String(index + 1).padStart(2, "0")}
        </span>
        {tutorial.grupo && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-faint-2)]">
            {tutorial.grupo}
          </span>
        )}
      </div>
      <h3 className="font-[family-name:var(--font-display)] font-bold text-xl leading-tight tracking-[-0.5px] m-0" style={{ lineHeight: 1.18 }}>
        {tutorial.titulo}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-muted)] m-0 flex-1">{tutorial.descricao}</p>
      <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--color-accent-strong)" }}>
        {stepsCount(tutorial.conteudo)} etapas · {readingTime(tutorial.conteudo)}
      </span>
    </Link>
  );
}
