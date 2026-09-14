import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchArticleBySlug, fetchRelatedArticles, getStrapiMedia } from '@/src/lib/strapi';
import { readingTime, initials } from '@/src/lib/format';
import { Blocks } from '@/src/components/Blocks';
import { DetailHeader } from '@/src/components/DetailHeader';
import { RelatedArticles } from '@/src/components/RelatedArticles';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchArticleBySlug(resolvedParams.slug);
  if (!article) return { title: 'Não encontrado' };

  return {
    title: `${article.title} | SEDEC.NEWS`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await fetchArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const coverUrl = article.cover ? getStrapiMedia(article.cover.url) : null;
  const formattedDate = format(new Date(article.publishedAt), 'dd MMM yyyy', { locale: ptBR });
  const related = await fetchRelatedArticles(article.category?.slug, article.id, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />
      <article className="flex-1">
        <DetailHeader
          backHref="/noticias"
          backLabel="Notícias"
          kicker={article.category?.name || "Notícias"}
          title={article.title}
          dek={article.description}
          meta={
            article.author
              ? {
                  authorInitials: initials(article.author.name),
                  author: article.author.name,
                  date: formattedDate,
                  read: readingTime(article.blocks),
                }
              : undefined
          }
          coverUrl={coverUrl}
          coverAlt={article.cover?.alternativeText || article.title}
        />

        <div className="max-w-[1120px] mx-auto px-6 pt-11 pb-6">
          {article.blocks && article.blocks.length > 0 ? (
            <Blocks blocks={article.blocks} />
          ) : (
            <div className="py-12 text-center text-[var(--color-muted)]">
              Nenhum conteúdo disponível para este artigo.
            </div>
          )}

          <RelatedArticles articles={related} />
        </div>
      </article>
      <Footer />
    </div>
  );
}
