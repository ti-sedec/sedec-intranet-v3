import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import ComunicadosFeed from "@/src/components/ComunicadosFeed";
import { fetchComunicados } from "@/src/lib/strapi";
import Link from "next/link";
import Pagination from "@/src/components/Pagination";

export default async function ComunicadosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const { data: listComunicados, meta } = await fetchComunicados(currentPage, 5);

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
        <div className="mt-12">
          {meta && meta.pagination.pageCount > 1 && (
            <Pagination
              currentPage={currentPage}
              pageCount={meta.pagination.pageCount}
              basePath="/comunicados"
            />
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
