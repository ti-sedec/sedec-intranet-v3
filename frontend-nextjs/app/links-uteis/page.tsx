import { PageHeading } from "@/src/components/PageHeading";
import { LinkCard } from "@/src/components/LinkCard";
import { Reveal } from "@/src/components/motion/Reveal";
import { stagger } from "@/src/lib/motion";
import { fetchLinksUteis } from "@/src/lib/strapi";

export const metadata = {
  title: "Links úteis | SEDEC.NEWS",
  description: "Sistemas internos, portais oficiais e serviços que a equipe usa todos os dias.",
};

export const dynamic = "force-dynamic";

export default async function LinksUteisPage() {
  const links = await fetchLinksUteis();

  return (
    <main className="flex-1 flex flex-col">

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Acesso rápido"
          title="Links úteis"
          dek="Sistemas internos, portais oficiais e serviços que a equipe usa todos os dias."
        />

        {links.length === 0 ? (
          <div className="py-16 text-center text-[var(--color-muted)]">
            Nenhum link cadastrado no momento.
          </div>
        ) : (
          <div className="grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
            {links.map((l, i) => (
              <Reveal key={l.id} delay={stagger(i, 0.04)} className="min-w-0">
                <LinkCard link={l} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
