import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Article } from "@/src/types/strapi";
import { getStrapiMedia } from "@/src/lib/strapi";
import { readingTime } from "@/src/lib/format";
import { CoverPlaceholder } from "./CoverPlaceholder";

type Variant = "featured" | "compact" | "grid" | "row";

function coverUrl(article: Article) {
  if (!article.cover) return null;
  const url =
    article.cover.formats?.medium?.url ||
    article.cover.formats?.small?.url ||
    article.cover.url;
  return getStrapiMedia(url);
}

function Meta({ article, showAuthor }: { article: Article; showAuthor?: boolean }) {
  const date = format(new Date(article.publishedAt), "dd MMM yyyy", { locale: ptBR });
  const read = readingTime(article.blocks);
  return (
    <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--color-faint-2)]">
      {showAuthor && article.author && (
        <>
          <span>{article.author.name}</span>
          <span>·</span>
        </>
      )}
      <span>{date}</span>
      <span>·</span>
      <span>{read}</span>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--color-accent-strong)" }}>
      {children}
    </span>
  );
}

export function ArticleCard({ article, variant = "grid" }: { article: Article; variant?: Variant }) {
  const href = `/artigo/${article.slug}`;
  const image = coverUrl(article);

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className="group no-underline block flex-[2_1_420px] min-w-0 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[var(--color-accent-soft)] hover:shadow-[0_10px_28px_-14px_oklch(0.55_0.17_45_/_0.45)]"
      >
        {image ? (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/8" }}>
            <Image
              src={image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              priority
            />
          </div>
        ) : (
          <CoverPlaceholder label="foto de capa" ratio="16/8" className="rounded-none border-0" />
        )}
        <div className="px-7 pt-6.5 pb-7.5">
          {article.category && <Kicker>{article.category.name}</Kicker>}
          <h2
            className="font-[family-name:var(--font-display)] font-bold m-0 mt-3 mb-3 text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-accent-strong)]"
            style={{ fontSize: "clamp(24px,3vw,38px)", lineHeight: 1.08, letterSpacing: "-0.9px" }}
          >
            {article.title}
          </h2>
          <p className="text-[17px] leading-[1.55] text-[var(--color-ink-soft)] max-w-[62ch] mt-0 mb-4.5">
            {article.description}
          </p>
          <Meta article={article} showAuthor />
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group no-underline block pb-3.5 border-b border-[var(--color-border)] text-inherit transition-colors duration-200 hover:border-[var(--color-accent-soft)]"
      >
        {article.category && <Kicker>{article.category.name}</Kicker>}
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-lg leading-tight tracking-[-0.3px] m-0 mt-2 mb-1.5 text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-accent-strong)]">
          {article.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-muted)] m-0">{article.description}</p>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={href}
        className="group no-underline grid grid-cols-1 sm:grid-cols-3 gap-7 py-6.5 px-3 -mx-3 rounded-md border-b border-[var(--color-border)] transition-colors duration-200 hover:bg-[var(--color-surface-alt)] hover:border-[var(--color-accent-soft)] text-inherit"
      >
        {image ? (
          <div className="relative max-w-[320px] w-full rounded-[5px] overflow-hidden border border-[var(--color-border)]" style={{ aspectRatio: "16/10" }}>
            <Image
              src={image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </div>
        ) : (
          <CoverPlaceholder label="foto de capa" className="max-w-[320px]" />
        )}
        <div className="min-w-0 sm:col-span-2">
          {article.category && <Kicker>{article.category.name}</Kicker>}
          <h3
            className="font-[family-name:var(--font-display)] font-bold m-0 mt-2 mb-2.5 text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-accent-strong)]"
            style={{ fontSize: "clamp(20px,2.4vw,28px)", lineHeight: 1.15, letterSpacing: "-0.6px" }}
          >
            {article.title}
          </h3>
          <p className="text-[15px] leading-[1.55] text-[var(--color-muted)] max-w-[70ch] mt-0 mb-3.5">
            {article.description}
          </p>
          <Meta article={article} showAuthor />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group no-underline block min-w-0 text-inherit">
      {image ? (
        <div
          className="relative w-full rounded-[5px] overflow-hidden border border-[var(--color-border)] mb-3.5 transition-colors duration-200 group-hover:border-[var(--color-accent-soft)]"
          style={{ aspectRatio: "16/10" }}
        >
          <Image
            src={image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <CoverPlaceholder label="foto de capa" className="mb-3.5" />
      )}
      {article.category && <Kicker>{article.category.name}</Kicker>}
      <h3 className="font-[family-name:var(--font-display)] font-semibold text-[19px] leading-tight tracking-[-0.4px] m-0 mt-2 mb-1.5 text-[var(--color-ink)] transition-colors duration-200 group-hover:text-[var(--color-accent-strong)]">
        {article.title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--color-muted)] mt-0 mb-2.5">{article.description}</p>
      <Meta article={article} />
    </Link>
  );
}
