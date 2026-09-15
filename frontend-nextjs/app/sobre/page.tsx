import { notFound } from "next/navigation";
import { fetchAbout, fetchArticles, fetchAniversariantesDoMes } from "@/src/lib/strapi";
import { Blocks } from "@/src/components/Blocks";
import { DetailHeader } from "@/src/components/DetailHeader";
import { FeaturedArticlesAside } from "@/src/components/FeaturedArticlesAside";
import { BirthdaysAside } from "@/src/components/BirthdaysAside";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

export const metadata = {
  title: "Sobre | SEDEC.NEWS",
  description: "Missão, visão e valores da Secretaria de Estado de Desenvolvimento Econômico de Mato Grosso.",
};

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const [about, { data: articles }, birthdays] = await Promise.all([
    fetchAbout(),
    fetchArticles({ page: 1, pageSize: 3 }),
    fetchAniversariantesDoMes(),
  ]);

  if (!about) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />
      <article className="flex-1">
        <DetailHeader
          backHref="/"
          backLabel="Home"
          kicker="Institucional"
          title={about.title || "Sobre a SEDEC"}
          dek="Missão, visão e valores da Secretaria de Estado de Desenvolvimento Econômico de Mato Grosso."
        />

        <div className="max-w-[1280px] mx-auto px-6 pt-11 pb-6 grid gap-10 items-start lg:grid-cols-[minmax(0,720px)_minmax(300px,1fr)]">
          <div className="min-w-0">
            {about.blocks && about.blocks.length > 0 ? (
              <Blocks blocks={about.blocks} />
            ) : (
              <div className="py-12 text-center text-[var(--color-muted)]">
                Conteúdo institucional em breve.
              </div>
            )}
          </div>

          <aside className="min-w-0 flex flex-col gap-8">
            <FeaturedArticlesAside articles={articles} />
            <BirthdaysAside birthdays={birthdays} />
          </aside>
        </div>
      </article>
      <Footer />
    </div>
  );
}
