import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import ComunicadosFeed from "@/src/components/ComunicadosFeed";
import { fetchComunicados } from "@/src/lib/strapi";
import Link from "next/link";

export default async function ComunicadosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const { data: listComunicados, meta } = await fetchComunicados(currentPage, 15);

  return (
    <main className="min-h-screen bg-white text-[#0f1115] selection:bg-[rgb(25,50,130)] selection:text-white flex flex-col">
      <Header />

      <section className="flex-grow p-8 md:p-16 max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-[rgb(25,50,130)] transition-colors mb-6"
          >
            ← Voltar para INÍCIO
          </Link>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Acompanhe os comunicados importantes e anúncios oficiais.
          </p>
        </div>

        <ComunicadosFeed comunicados={listComunicados} hideFooterLink={true} />

        {/* Pagination */}
        {meta && meta.pagination.pageCount > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/comunicados?page=${currentPage - 1}`}
                className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
              >
                ← Anterior
              </Link>
            )}

            <div className="brutalist-border px-6 py-3 font-bold bg-[#0f1115] text-white">
              {currentPage} / {meta.pagination.pageCount}
            </div>

            {currentPage < meta.pagination.pageCount && (
              <Link
                href={`/comunicados?page=${currentPage + 1}`}
                className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
              >
                Próxima →
              </Link>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
