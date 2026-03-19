
import React, { Suspense } from "react";
import Image from "next/image";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { fetchGlobalAgendaUrl } from "@/src/lib/strapi";

export const metadata = {
  title: "Eventos | SEDEC.NEWS",
  description: "Acompanhe os próximos eventos da Secretaria de Desenvolvimento Econômico.",
};

function CalendarSkeleton() {
  return (
    <div className="w-full h-full min-h-[600px] md:min-h-[800px] flex flex-col items-center justify-center p-8 bg-[#fcfcfc] animate-pulse">
      <div className="w-16 h-16 border-4 border-[rgb(25,50,130)] border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-xl font-bold uppercase tracking-widest text-[#0f1115]">
        Carregando Agenda...
      </p>
      <p className="text-gray-500 font-mono text-sm mt-2">
        Sincronizando com o Google Calendar
      </p>
    </div>
  );
}

async function CalendarWidget() {
  const agendaUrl = await fetchGlobalAgendaUrl();

  if (!agendaUrl) {
    return (
      <div className="w-full h-full min-h-[600px] md:min-h-[800px] flex flex-col items-center justify-center p-8 bg-[#fcfcfc] text-center">
        <p className="text-gray-500 font-medium uppercase tracking-widest mb-2">Aviso</p>
        <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f1115] mb-4">Agenda Não Configurada</h2>
        <p className="text-gray-600 max-w-md">
          A URL da agenda ainda não foi configurada no painel global.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Version: View Mês */}
      <iframe 
        src={agendaUrl} 
        style={{ border: 0 }} 
        className="absolute top-0 left-0 w-full h-full p-2 md:p-4 hidden md:block bg-white" 
        frameBorder="0" 
        scrolling="no"
        title="Agenda de Eventos (Mês)"
      ></iframe>

      {/* Mobile Version: View Agenda (Programação) */}
      <iframe 
        src={`${agendaUrl}&mode=AGENDA`} 
        style={{ border: 0 }} 
        className="absolute top-0 left-0 w-full h-full p-2 block md:hidden bg-white" 
        frameBorder="0" 
        scrolling="auto"
        title="Agenda de Eventos (Programação)"
      ></iframe>
    </>
  );
}

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <header className="relative w-full min-h-[40vh] md:min-h-[50vh] flex flex-col justify-end pb-12 px-6 md:px-12 lg:px-24 border-b-4 border-[rgb(25,50,130)]">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0f1115]">
          <Image
            src="/eventos-wallpaper.jpg"
            alt="Agenda de Eventos"
            fill
            priority
            className="object-cover opacity-50 mix-blend-overlay saturate-50 contrast-125 transition-transform duration-[2s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full lg:w-10/12">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-white text-[#0f1115] font-mono text-xs md:text-sm tracking-widest uppercase border-2 border-[#0f1115] shadow-[4px_4px_0px_0px_rgba(25,50,130,1)]">
              Agenda Institucional
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-4 w-full uppercase">
            Eventos
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-3xl font-light">
            Acompanhe a agenda, reuniões executivas e workshops da Secretaria de Desenvolvimento Econômico.
          </p>
        </div>
      </header>
      
      <div className="max-w-7xl w-full mx-auto px-6 py-12 flex-grow flex flex-col">
        <div className="w-full relative min-h-[600px] md:min-h-[800px] border-2 border-[#0f1115] bg-[#fcfcfc] brutalist-shadow">
          <Suspense fallback={<CalendarSkeleton />}>
            <CalendarWidget />
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
