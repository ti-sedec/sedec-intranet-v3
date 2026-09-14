import Link from "next/link";
import type { Article } from "@/src/types/strapi";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  return (
    <div className="mt-14 pt-7 border-t-2 border-[var(--color-ink)]">
      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-[22px] m-0 mb-5" style={{ letterSpacing: "-0.5px" }}>
        Leia também
      </h2>
      {articles.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)] m-0">Nenhum outro artigo relacionado no momento.</p>
      ) : (
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {articles.map((a) => (
          <Link key={a.id} href={`/artigo/${a.slug}`} className="no-underline text-inherit min-w-0">
            {a.category && (
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-accent-strong)" }}>
                {a.category.name}
              </span>
            )}
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-[17px] leading-snug tracking-[-0.3px] m-0 mt-2">
              {a.title}
            </h3>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}
