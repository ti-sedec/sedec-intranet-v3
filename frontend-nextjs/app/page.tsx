import Image from "next/image";
import Link from "next/link";
import { fetchArticles, getStrapiMedia } from "../src/lib/strapi";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Article } from "../src/types/strapi";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const { data: articles, meta } = await fetchArticles(currentPage);

  if (!articles || articles.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#0f1115] p-8 md:p-16 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4 text-center">Nenhuma Notícia Encontrada</h1>
        <p className="text-xl">Não há artigos publicados no momento.</p>
      </main>
    );
  }

  const heroArticle = articles[0];
  const listArticles = articles.slice(1);

  return (
    <main className="min-h-screen bg-white text-[#0f1115] selection:bg-[rgb(25,50,130)] selection:text-white">
      {/* Header Corporativo Minimalista */}
      <Header />

      {/* Hero Section Brutalista e Assimétrica (90/10 Focus) */}
      <section className="relative w-full h-[85vh] border-b-2 border-[#0f1115] overflow-hidden group">
        {heroArticle.cover && getStrapiMedia(heroArticle.cover.formats?.large?.url || heroArticle.cover.formats?.medium?.url || heroArticle.cover.url) && (
          <Image
            src={getStrapiMedia(heroArticle.cover.formats?.large?.url || heroArticle.cover.formats?.medium?.url || heroArticle.cover.url) as string}
            alt={heroArticle.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        )}

        {/* Overlay em Mix-Blend e Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-90"></div>
        <div className="absolute inset-0 bg-[rgb(25,50,130)] opacity-20 mix-blend-multiply"></div>

        <div className="absolute bottom-0 left-0 w-full md:w-[85%] bg-white border-t-2 border-r-2 border-[#0f1115] p-8 md:p-16 transform transition-transform duration-500">
          <div className="mb-4 inline-block bg-[#0f1115] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Destaque
          </div>
          <Link href={`/artigo/${heroArticle.slug}`} className="block group/link">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tighter leading-[0.9] mb-6 group-hover/link:text-[rgb(25,50,130)] transition-colors">
              {heroArticle.title}
            </h2>
          </Link>
          <p className="text-lg md:text-2xl font-light mb-8 max-w-3xl line-clamp-2">
            {heroArticle.description}
          </p>
          <div className="flex items-center gap-4 text-sm font-medium uppercase tracking-wider">
            <span>
              {format(new Date(heroArticle.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
            <div className="w-12 h-[2px] bg-[rgb(25,50,130)]"></div>
            <Link
              href={`/artigo/${heroArticle.slug}`}
              className="hover:text-[rgb(25,50,130)] transition-colors"
            >
              Ler Matéria Completa →
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de Feed de Notícias (Grid quebrado / Fragmentado) */}
      {listArticles.length > 0 && (
        <section className="p-8 md:p-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b-2 border-[#0f1115] pb-4">
            <h3 className="text-3xl font-bold uppercase tracking-tighter">Últimas Atualizações</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {listArticles.map((article: Article) => (
              <article key={article.id} className="group flex flex-col h-full brutalist-border bg-[#fcfcfc] brutalist-shadow">
                {article.cover && getStrapiMedia(article.cover.formats?.medium?.url || article.cover.formats?.small?.url || article.cover.url) && (
                  <div className="relative aspect-[4/3] w-full border-b-2 border-[#0f1115] overflow-hidden">
                    <Image
                      src={getStrapiMedia(article.cover.formats?.medium?.url || article.cover.formats?.small?.url || article.cover.url) as string}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs font-bold uppercase tracking-widest text-[rgb(25,50,130)] mb-3">
                    {format(new Date(article.publishedAt), "dd MMM yyyy", { locale: ptBR })}
                  </div>
                  <Link href={`/artigo/${article.slug}`}>
                    <h4 className="text-2xl font-bold leading-tight mb-4 uppercase tracking-tighter group-hover:text-[rgb(25,50,130)] transition-colors line-clamp-3">
                      {article.title}
                    </h4>
                  </Link>
                  <p className="text-base text-gray-700 line-clamp-3 mb-6 flex-grow">
                    {article.description}
                  </p>
                  <Link
                    href={`/artigo/${article.slug}`}
                    className="mt-auto inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-[rgb(25,50,130)] transition-colors before:content-[''] before:w-6 before:h-[2px] before:bg-current before:mr-3"
                  >
                    Ler Mais
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Paginação Brutalista */}
      {meta.pagination.pageCount > 1 && (
        <section className="p-8 md:p-16 pt-0 max-w-7xl mx-auto flex justify-center">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
              >
                ← Anterior
              </Link>
            )}

            <div className="brutalist-border px-6 py-3 font-bold bg-[#0f1115] text-white">
              {currentPage} / {meta.pagination.pageCount}
            </div>

            {currentPage < meta.pagination.pageCount && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
              >
                Próxima →
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Footer Minimalista */}
      <Footer />
    </main>
  );
}
