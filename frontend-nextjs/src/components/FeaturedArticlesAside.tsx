import Link from "next/link";
import type { Article } from "@/src/types/strapi";
import { ArticleCard } from "./ArticleCard";

export function FeaturedArticlesAside({ articles }: { articles: Article[] }) {
  const top = articles.slice(0, 3);

  return (
    <div>
      <div className="border-b-2 border-[var(--color-ink)] pb-3 mb-4">
        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl m-0" style={{ letterSpacing: "-0.5px" }}>
          Em destaque
        </h2>
      </div>
      {top.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)] m-0">Nenhuma notícia publicada no momento.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {top.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      )}
      <Link
        href="/noticias"
        className="no-underline mt-3 inline-block font-mono text-[11px] font-semibold uppercase tracking-[0.1em]"
        style={{ color: "var(--color-link)" }}
      >
        Ver todas →
      </Link>
    </div>
  );
}
