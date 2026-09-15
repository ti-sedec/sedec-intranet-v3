import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { ArticleCard } from "@/src/components/ArticleCard";
import { BirthdaysSection } from "@/src/components/BirthdaysSection";
import { QuickLinksAside } from "@/src/components/QuickLinksAside";
import { LatestNewsSection } from "@/src/components/LatestNewsSection";
import {
  fetchArticles,
  fetchAniversariantesDoMes,
  fetchLinksUteis,
} from "@/src/lib/strapi";

export const dynamic = "force-dynamic";

const LATEST_PAGE_SIZE = 4;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;

  const [{ data: articles }, birthdays, links] = await Promise.all([
    fetchArticles({ page: 1, pageSize: 4 }),
    fetchAniversariantesDoMes(),
    fetchLinksUteis(),
  ]);

  const today = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const featured = articles[0];
  const secondary = articles.slice(1, 4);

  const { data: latest, meta: latestMeta } = featured
    ? await fetchArticles({
        page: currentPage,
        pageSize: LATEST_PAGE_SIZE,
        excludeId: featured.id,
      })
    : { data: [], meta: { pagination: { pageCount: 0 } } };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />

      {!featured ? (
        <div className="max-w-[1280px] mx-auto px-6 py-24 text-center text-[var(--color-muted)]">
          Nenhum artigo publicado no momento.
        </div>
      ) : (
        <>
          <section className="max-w-[1280px] mx-auto w-full px-6 pt-10 pb-2">
            <div className="flex items-baseline gap-4 flex-wrap mb-6">
              <h1
                className="font-[family-name:var(--font-display)] font-extrabold m-0"
                style={{ fontSize: "clamp(30px,4.4vw,52px)", letterSpacing: "-1.4px", lineHeight: 1 }}
              >
                Boletim interno
              </h1>
              <span className="font-mono text-xs tracking-[0.1em] uppercase text-[var(--color-faint)]">
                {today}
              </span>
            </div>

            <div className="flex flex-wrap gap-7 items-start">
              <ArticleCard article={featured} variant="featured" />

              <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-3.5">
                <div className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-faint)] pb-2.5 border-b border-[var(--color-border-strong)]">
                  Em destaque
                </div>
                {secondary.length === 0 ? (
                  <p className="text-sm text-[var(--color-muted)] m-0">Nenhuma outra notícia publicada no momento.</p>
                ) : (
                  secondary.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))
                )}
              </div>
            </div>
          </section>

          <BirthdaysSection birthdays={birthdays} />

          <section className="max-w-[1280px] mx-auto w-full px-6 pt-14 pb-18 flex flex-wrap gap-12 items-start">
            <div className="flex-[2_1_440px] min-w-0">
              <div className="flex items-center justify-between gap-4 flex-wrap border-b-2 border-[var(--color-ink)] pb-3 mb-6">
                <h2 className="font-[family-name:var(--font-display)] font-extrabold text-[26px] m-0" style={{ letterSpacing: "-0.7px" }}>
                  Últimas notícias
                </h2>
                <Link
                  href="/noticias"
                  className="no-underline font-mono text-[11px] font-semibold uppercase tracking-[0.1em] border border-[var(--color-border-strong-2)] rounded px-3.5 py-2 hover:bg-[var(--color-ink)] hover:text-white hover:border-[var(--color-ink)]"
                >
                  Ver todas
                </Link>
              </div>
              <LatestNewsSection
                initialArticles={latest}
                initialPage={currentPage}
                initialPageCount={latestMeta.pagination.pageCount}
                pageSize={LATEST_PAGE_SIZE}
                excludeId={featured.id}
              />
            </div>

            <aside className="flex-[1_1_280px] min-w-0 flex flex-col gap-8">
              <QuickLinksAside links={links} />

              <div className="group rounded-md p-6 text-white bg-[var(--color-accent)] transition-[background-color,box-shadow] duration-500 ease-out hover:bg-[var(--color-ink)] hover:shadow-[0_10px_28px_-14px_oklch(0.55_0.17_45_/_0.45)]">
                <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase opacity-85">
                  Base de conhecimento
                </span>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-xl leading-snug tracking-[-0.5px] mt-2.5 mb-2.5">
                  Tutoriais dos sistemas internos
                </h3>
                <p className="text-sm leading-relaxed opacity-90 mt-0 mb-4">
                  Passo a passo de requisições, plantões e emissão de relatórios.
                </p>
                <Link
                  href="/tutoriais"
                  className="no-underline inline-block bg-[var(--color-ink)] text-white rounded px-4 py-2.5 text-sm font-semibold transition-colors duration-500 ease-out group-hover:bg-[var(--color-accent)]"
                >
                  Abrir central de ajuda
                </Link>
              </div>
            </aside>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}
