import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { PageHeading } from "@/src/components/PageHeading";
import { LinkCard } from "@/src/components/LinkCard";
import { fetchLinksUteis } from "@/src/lib/strapi";

export const metadata = {
  title: "Links úteis | SEDEC.NEWS",
  description: "Sistemas internos, portais oficiais e serviços que a equipe usa todos os dias.",
};

export const dynamic = "force-dynamic";

export default async function LinksUteisPage() {
  const links = await fetchLinksUteis();

  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />

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
            {links.map((l) => (
              <LinkCard key={l.id} link={l} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
