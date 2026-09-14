import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTutorialBySlug } from "@/src/lib/strapi";
import { readingTime, headings } from "@/src/lib/format";
import { Blocks } from "@/src/components/Blocks";
import { DetailHeader } from "@/src/components/DetailHeader";
import { TutorialIndex } from "@/src/components/TutorialIndex";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const tutorial = await fetchTutorialBySlug(resolvedParams.slug);
  if (!tutorial) return { title: "Não encontrado" };

  return {
    title: `${tutorial.titulo} | SEDEC.NEWS`,
    description: tutorial.descricao,
  };
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tutorial = await fetchTutorialBySlug(resolvedParams.slug);

  if (!tutorial) {
    notFound();
  }

  const index = headings(tutorial.conteudo);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />
      <article className="flex-1">
        <DetailHeader
          backHref="/tutoriais"
          backLabel="Tutoriais"
          kicker={`Tutorial${tutorial.grupo ? ` · ${tutorial.grupo}` : ""}`}
          title={tutorial.titulo}
          dek={tutorial.descricao}
        />

        <div className="max-w-[1120px] mx-auto px-6 pt-11 pb-6 flex flex-wrap gap-11 items-start">
          <TutorialIndex items={index} />
          <div className="flex-[3_1_420px] min-w-0 max-w-[720px]">
            {tutorial.conteudo && tutorial.conteudo.length > 0 ? (
              <Blocks blocks={tutorial.conteudo} />
            ) : (
              <div className="py-12 text-center text-[var(--color-muted)]">
                Nenhum conteúdo disponível para este tutorial.
              </div>
            )}
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] mt-8" style={{ color: "var(--color-accent-strong)" }}>
              {readingTime(tutorial.conteudo)} de leitura
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
