import React, { Suspense } from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { PageHeading } from "@/src/components/PageHeading";
import { fetchGlobal } from "@/src/lib/strapi";

export const metadata = {
  title: "Eventos | SEDEC.NEWS",
  description: "Acompanhe os próximos eventos da Secretaria de Desenvolvimento Econômico.",
};

export const dynamic = "force-dynamic";

function CalendarSkeleton() {
  return (
    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-alt)]">
      <div
        className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
      />
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-faint)]">
        Carregando agenda…
      </p>
    </div>
  );
}

async function CalendarWidget() {
  const global = await fetchGlobal();
  const agendaUrl = global?.agendaUrl;

  if (!agendaUrl) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-faint)]">Aviso</p>
        <h2 className="font-[family-name:var(--font-display)] font-bold text-2xl m-0">Agenda não configurada</h2>
        <p className="text-[var(--color-muted)] max-w-md">
          A URL da agenda ainda não foi configurada no painel global do Strapi.
        </p>
      </div>
    );
  }

  return (
    <>
      <iframe
        src={agendaUrl}
        style={{ border: 0 }}
        className="absolute top-0 left-0 w-full h-full hidden md:block"
        title="Agenda de eventos (mês)"
      />
      <iframe
        src={`${agendaUrl}&mode=AGENDA`}
        style={{ border: 0 }}
        className="absolute top-0 left-0 w-full h-full block md:hidden"
        title="Agenda de eventos (programação)"
      />
    </>
  );
}

export default function EventosPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <Header />

      <section className="max-w-[1280px] mx-auto w-full px-6 pt-11 pb-8">
        <PageHeading
          kicker="Agenda"
          title="Eventos"
          dek="Acompanhe a agenda, reuniões executivas e workshops da Secretaria de Desenvolvimento Econômico."
        />
      </section>

      <div className="max-w-[1280px] w-full mx-auto px-6 pb-16 flex-1">
        <div className="w-full relative min-h-[600px] rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <Suspense fallback={<CalendarSkeleton />}>
            <CalendarWidget />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}
