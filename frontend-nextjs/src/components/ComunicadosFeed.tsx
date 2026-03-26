"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getComunicadoDetails } from "@/src/app/actions";
import { Blocks } from "./Blocks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Basic interface based on user payload
interface Comunicado {
  id: number;
  documentId: string;
  titulo: string;
  publishedAt: string;
  blocks?: any[];
}

export default function ComunicadosFeed({
  comunicados,
  hideFooterLink = false,
}: {
  comunicados: Comunicado[];
  hideFooterLink?: boolean;
}) {
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null);
  const [detailedContent, setDetailedContent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenModal = async (comunicado: Comunicado) => {
    const hasContent = comunicado.blocks && comunicado.blocks.length > 0;
    if (!hasContent) return; // Prevent opening if it only has a title

    setSelectedComunicado(comunicado);
    setIsModalOpen(true);
    setDetailedContent(null);
    setIsLoading(true);

    try {
      const details = await getComunicadoDetails(comunicado.documentId);
      setDetailedContent(details);
    } catch (error) {
      console.error("Failed to load details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedComunicado(null);
      setDetailedContent(null);
    }, 300); // Wait for transition
  };

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <h3 className="text-3xl font-bold uppercase tracking-tighter mb-8 border-b-2 border-[#0f1115] pb-4">
        Comunicados
      </h3>

      {/* List */}
      <div className="flex flex-col gap-4 flex-grow brutalist-border p-6 bg-[#fcfcfc] brutalist-shadow">
        {comunicados.length === 0 ? (
          <div className="min-h-[200px] flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-sm text-center">
            Nenhum comunicado no momento.
          </div>
        ) : (
          <ul className="flex flex-col flex-grow">
            {comunicados.map((item, index) => {
              const hasContent = item.blocks && item.blocks.length > 0;
              const isLast = index === comunicados.length - 1;

              return (
                <li
                  key={item.id}
                  className={`${!isLast ? "border-b-2 border-gray-200" : ""}`}
                >
                  {hasContent ? (
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-left w-full block p-4 -mx-4 border-2 border-transparent transition-all duration-200 hover:bg-white hover:border-[#0f1115] hover:shadow-[4px_4px_0_0_rgb(25,50,130)] hover:-translate-y-1 hover:-translate-x-1 focus:outline-none group relative z-10 hover:z-20"
                    >
                      <div className="text-xs font-bold uppercase tracking-widest text-[rgb(25,50,130)] mb-1">
                        {format(new Date(item.publishedAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                      <h4 className="text-xl font-bold leading-tight uppercase tracking-tighter transition-colors line-clamp-2">
                        {item.titulo}
                      </h4>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0f1115] bg-[#fcfcfc] border-2 border-[#0f1115] px-2 py-1 mt-4 inline-block group-hover:bg-[#0f1115] group-hover:text-white transition-all">
                        Ler comunicado →
                      </span>
                    </button>
                  ) : (
                    <div className="text-left w-full block py-4 px-0 border-2 border-transparent">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                        {format(new Date(item.publishedAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                      <h4 className="text-xl font-bold leading-tight uppercase tracking-tighter line-clamp-2 text-[#0f1115]/70">
                        {item.titulo}
                      </h4>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer link */}
      {!hideFooterLink && (
        <Link
          href="/comunicados"
          className="mt-6 inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-[rgb(25,50,130)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f1115] focus:ring-offset-4 self-start"
        >
          <div className="w-8 h-[2px] bg-current mr-3"></div>
          Buscar Outros
        </Link>
      )}

      {/* Dialog Modal via Portal to escape sticky stacking context */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 pt-20">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white w-full max-w-4xl max-h-full flex flex-col brutalist-border brutalist-shadow overflow-hidden translate-y-0 opacity-100 transition-all"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 border-b-2 border-[#0f1115] bg-[#fcfcfc]">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-[rgb(25,50,130)] mb-2">
                  {selectedComunicado &&
                    format(
                      new Date(selectedComunicado.publishedAt),
                      "dd 'de' MMMM, yyyy",
                      { locale: ptBR }
                    )}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tighter leading-tight">
                  {selectedComunicado?.titulo}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 flex-shrink-0 w-12 h-12 flex items-center justify-center brutalist-border hover:bg-[#0f1115] hover:text-white transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-grow bg-white">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0f1115] rounded-full animate-spin mb-4"></div>
                  <p className="font-bold uppercase tracking-widest text-sm text-gray-500">
                    Carregando conteúdo...
                  </p>
                </div>
              ) : detailedContent && detailedContent.blocks ? (
                <div className="prose-brutalist max-w-none">
                  <Blocks blocks={detailedContent.blocks} />
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
                  Conteúdo indisponível.
                </div>
              )}
            </div>
            
            {/* Fixed footer block aesthetic */}
            <div className="h-4 bg-[#0f1115] w-full mt-auto"></div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
