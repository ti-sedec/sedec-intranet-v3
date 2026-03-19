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
        <div className="text-right">
          <p className="font-bold uppercase tracking-widest mb-1">Contato Interno</p>
          <p className="text-gray-400">{SUPPORT_EMAIL}</p>
        </div>
      </div>
    </footer>
  );
}
