import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { PageHeading } from "@/src/components/PageHeading";
import { CategoryPills } from "@/src/components/CategoryPills";
import { ArticleCard } from "@/src/components/ArticleCard";
import Pagination from "@/src/components/Pagination";
import { fetchArticles, fetchCategories } from "@/src/lib/strapi";

export const metadata = {
  title: "Notícias e comunicados | SEDEC.NEWS",
  description: "Tudo que foi publicado pela comunicação interna da SEDEC.",
};

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; categoria?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const categorySlug = resolvedParams?.categoria;

  const [{ data: articles, meta }, categories] = await Promise.all([
    fetchArticles({ page: currentPage, pageSize: 10, categorySlug }),
    fetchCategories(),
  ]);

  const basePath = categorySlug ? `/noticias?categoria=${categorySlug}` : "/noticias";

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Arquivo"
          title="Notícias e comunicados"
          dek="Tudo que foi publicado pela comunicação interna da SEDEC."
        />

        <CategoryPills categories={categories} />

        {articles.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-muted)]">
            Nenhum artigo encontrado para esta categoria.
          </div>
        ) : (
          <div className="flex flex-col">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="row" />
            ))}
          </div>
        )}
      </section>

      {meta.pagination.pageCount > 1 && (
        <section className="max-w-[1280px] mx-auto w-full px-6 pb-16">
          <Pagination currentPage={currentPage} pageCount={meta.pagination.pageCount} basePath={basePath} />
        </section>
      )}

      <Footer />
    </main>
  );
}
