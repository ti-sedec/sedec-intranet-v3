import { notFound } from "next/navigation";
import { fetchAbout } from "@/src/lib/strapi";
import { Blocks } from "@/src/components/Blocks";
import { DetailHeader } from "@/src/components/DetailHeader";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

export const metadata = {
  title: "Sobre | SEDEC.NEWS",
  description: "Missão, visão e valores da Secretaria de Estado de Desenvolvimento Econômico de Mato Grosso.",
};

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const about = await fetchAbout();

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

        <div className="max-w-[1120px] mx-auto px-6 pt-11 pb-6">
          {about.blocks && about.blocks.length > 0 ? (
            <Blocks blocks={about.blocks} />
          ) : (
            <div className="py-12 text-center text-[var(--color-muted)]">
              Conteúdo institucional em breve.
            </div>
          )}
        </div>
      </article>
      <Footer />
    </div>
  );
}
