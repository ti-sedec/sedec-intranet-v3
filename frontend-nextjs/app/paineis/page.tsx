import { Suspense } from "react";
import { PageHeading } from "@/src/components/PageHeading";
import PaineisList from "@/src/components/PaineisList";
import { fetchPaineis } from "@/src/lib/strapi";

export const metadata = {
  title: "Painéis | SEDEC.NEWS",
  description: "Painéis de acompanhamento e indicadores dos setores da Secretaria.",
};

export const dynamic = "force-dynamic";

export default async function PaineisPage() {
  const lista = await fetchPaineis();

  return (
    <main className="flex-1 flex flex-col">

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-18 flex-1">
        <PageHeading
          kicker="Informações"
          title="Painéis"
          dek="Painéis de acompanhamento e indicadores dos setores da Secretaria."
        />

        <Suspense fallback={null}>
          <PaineisList paineis={lista} />
        </Suspense>
      </section>

    </main>
  );
}
