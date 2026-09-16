import Link from "next/link";
import { fetchGlobal } from "@/src/lib/strapi";
import { SUPPORT_EMAIL } from "@/src/lib/constants";

export default async function Footer() {
  const global = await fetchGlobal();
  const year = new Date().getFullYear();
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return (
    <footer className="bg-[var(--color-ink)] text-white mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid gap-9 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 md:col-span-2">
          <div className="flex items-center gap-3 mb-3.5">
            <span className="w-9 h-9 rounded-[3px] bg-[var(--color-accent)] text-white grid place-items-center font-mono font-semibold text-xs">
              S.N
            </span>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[19px] tracking-[-0.4px]">
              SEDEC.NEWS
            </span>
          </div>
          <p className="text-base leading-relaxed text-[#a8adbb] max-w-[44ch] m-0">
            {global?.siteDescription ||
              "Canal oficial de notícias, comunicados e conhecimento interno da Secretaria de Estado de Desenvolvimento Econômico."}
          </p>
        </div>

        <div className="min-w-0">
          <div className="font-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-[#9297a6] mb-3.5">
            Navegar
          </div>
          <div className="flex flex-col gap-2.5 items-start">
            <Link href="/noticias" className="no-underline text-[#e6e8ee] text-sm hover:text-[var(--color-accent-soft)]">Notícias</Link>
            <Link href="/tutoriais" className="no-underline text-[#e6e8ee] text-sm hover:text-[var(--color-accent-soft)]">Tutoriais</Link>
            <Link href="/links-uteis" className="no-underline text-[#e6e8ee] text-sm hover:text-[var(--color-accent-soft)]">Links úteis</Link>
            <Link href="/sobre" className="no-underline text-[#e6e8ee] text-sm hover:text-[var(--color-accent-soft)]">Sobre</Link>
          </div>
        </div>

        <div className="min-w-0">
          <div className="font-mono text-[11px] font-semibold tracking-[0.1em] uppercase text-[#9297a6] mb-3.5">
            Institucional
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#a8adbb]">
            <Link href="/eventos" className="no-underline text-[#e6e8ee]">
              Agenda da Secretaria ↗
            </Link>
            <Link href={`${strapiUrl}/admin`} className="no-underline text-[#e6e8ee]">
              Login (área restrita) ↗
            </Link>
            {global?.contatoRamal && <span>Ramal da Comunicação: {global.contatoRamal}</span>}
            <span>{global?.contatoEmail || SUPPORT_EMAIL}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-navy-border)]">
        <div className="max-w-[1280px] mx-auto px-6 py-4.5 flex gap-4 flex-wrap font-mono text-[11px] tracking-[0.08em] uppercase text-[#9297a6]">
          <span>© {year} SEDEC · Uso interno</span>
          <span className="ml-auto">Desenvolvido pela TI SEDEC</span>
        </div>
      </div>
    </footer>
  );
}
