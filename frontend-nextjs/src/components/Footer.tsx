import { SUPPORT_EMAIL } from "../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] text-white p-8 md:p-16 border-t-8 border-[rgb(25,50,130)] mt-auto w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="font-bold text-3xl uppercase tracking-tighter mb-2">
            SEDEC<span className="text-[rgb(25,50,130)]">.NEWS</span>
          </div>
          <p className="text-gray-400 max-w-sm">
            Sistema oficial de notícias e intranet da Secretaria de Desenvolvimento Econômico.
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="mb-6">
            <p className="font-bold uppercase tracking-widest mb-1">Contato Interno</p>
            <p className="text-gray-400">{SUPPORT_EMAIL}</p>
          </div>
          <div className="pt-4 border-t border-gray-800 w-full md:w-auto">
            <a
              href={process.env.NEXT_PUBLIC_STRAPI_URL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[rgb(25,50,130)] transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Acesso Restrito / ADMIN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
