import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchArticleBySlug, getStrapiMedia } from '@/src/lib/strapi';
import { Blocks } from '@/src/components/Blocks';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await fetchArticleBySlug(resolvedParams.slug);
  if (!article) return { title: 'Not Found' };
  
  return {
    title: `${article.title} | Sedec Intranet`,
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
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
  }).format(new Date(article.publishedAt));

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Typographic Brutalist Hero */}
      <header className="relative w-full min-h-[70vh] md:min-h-[85vh] flex flex-col justify-end pb-12 px-6 md:px-12 lg:px-24 mb-12 border-b-[3px] border-slate-900 dark:border-slate-100/50">
        {coverUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
            <Image
              src={coverUrl}
              alt={article.cover?.formats?.large?.alternativeText || article.title}
              fill
              priority
              className="object-cover opacity-60 mix-blend-overlay saturate-50 contrast-125 transition-transform duration-[2s] hover:scale-105"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl">
          {article.category && (
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-900 font-mono text-sm tracking-widest uppercase border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                {article.category.name}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-[15ch]">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 mt-8 font-mono text-slate-300 text-sm uppercase tracking-wider">
            {article.author && (
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 border border-slate-500 text-slate-400 text-xs">AUTOR</span>
                <span className="font-bold text-white">{article.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-blue-500 border border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"></span>
              <span className="font-medium text-slate-200">{formattedDate}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Parser */}
      {article.blocks && article.blocks.length > 0 ? (
        <main className="pb-24">
          <Blocks blocks={article.blocks} />
        </main>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-12 text-center text-slate-500 font-mono uppercase tracking-widest border border-dashed border-slate-300 m-12">
          Nenhum conteúdo disponível para este artigo.
        </div>
      )}
    </article>
  );
}
