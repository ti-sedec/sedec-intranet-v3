import Link from "next/link";
import { fetchGlobal } from "@/src/lib/strapi";
import { SUPPORT_EMAIL } from "@/src/lib/constants";

export default async function Footer() {
  const global = await fetchGlobal();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-ink)] text-white mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 py-12 grid gap-9" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="min-w-0" style={{ gridColumn: "span 2" }}>
          <div className="flex items-center gap-3 mb-3.5">
            <span className="w-9 h-9 rounded-[3px] bg-[var(--color-accent)] text-white grid place-items-center font-mono font-semibold text-xs">
              SD
            </span>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[19px] tracking-[-0.4px]">
              SEDEC.NEWS
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#a8adbb] max-w-[44ch] m-0">
            {global?.siteDescription ||
              "Canal oficial de notícias, comunicados e conhecimento interno da Secretaria de Estado de Desenvolvimento Econômico."}
          </p>
        </div>

        <div className="min-w-0">
          <div className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-faint)] mb-3.5">
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
          <div className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-faint)] mb-3.5">
            Institucional
          </div>
          <div className="flex flex-col gap-2.5 text-sm text-[#a8adbb]">
            <Link href="/eventos" className="no-underline text-[#e6e8ee]">
              Agenda da Secretaria ↗
            </Link>
            {global?.contatoRamal && <span>Ramal da Comunicação: {global.contatoRamal}</span>}
            <span>{global?.contatoEmail || SUPPORT_EMAIL}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-navy-border)]">
        <div className="max-w-[1280px] mx-auto px-6 py-4.5 flex gap-4 flex-wrap font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--color-faint)]">
          <span>© {year} SEDEC · Uso interno</span>
          <span className="ml-auto">Publicado via Strapi</span>
        </div>
      </div>
    </footer>
  );
}
