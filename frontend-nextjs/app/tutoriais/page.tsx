import { PageHeading } from "@/src/components/PageHeading";
import { TutorialCard } from "@/src/components/TutorialCard";
import { Reveal } from "@/src/components/motion/Reveal";
import { stagger } from "@/src/lib/motion";
import { fetchTutorials } from "@/src/lib/strapi";

export const metadata = {
  title: "Tutoriais | SEDEC.NEWS",
  description: "Guias curtos e objetivos para os sistemas, rotinas e processos internos da Secretaria.",
};

export const dynamic = "force-dynamic";

export default async function TutoriaisPage() {
  const tutorials = await fetchTutorials();

  return (
    <main className="flex-1 flex flex-col">

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Central de ajuda"
          title="Tutoriais"
          dek="Guias curtos e objetivos para os sistemas, rotinas e processos internos da Secretaria."
        />

        {tutorials.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-muted)]">
            Nenhum tutorial publicado no momento.
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {tutorials.map((t, i) => (
              <Reveal key={t.id} delay={stagger(i, 0.05)} className="min-w-0">
                <TutorialCard tutorial={t} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
