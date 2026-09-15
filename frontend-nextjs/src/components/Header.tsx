"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/noticias", label: "Notícias" },
  { href: "/tutoriais", label: "Tutoriais" },
  { href: "/links-uteis", label: "Links úteis" },
  { href: "/sobre", label: "Sobre" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6 py-3.5 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-[3px] bg-[var(--color-accent)] text-white grid place-items-center font-mono font-semibold text-[13px] tracking-[-0.5px]">
            S.N
          </span>
          <span className="flex flex-col leading-[1.1]">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[20px] tracking-[-0.4px] text-[var(--color-ink)]">
              SEDEC<span className="text-[var(--color-accent)]">.NEWS</span>
            </span>
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-faint)]">
              Secretaria de Estado de Desenvolvimento Econômico
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`no-underline px-[13px] py-[9px] rounded text-sm font-medium hover:bg-[#ebe7df] ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/eventos"
            className="ml-2 inline-flex items-center gap-2 bg-[var(--color-ink)] text-white px-4 py-2.5 rounded text-[13px] font-semibold no-underline hover:bg-[var(--color-accent)] hover:text-white"
          >
            Agenda
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="lg:hidden ml-auto grid place-items-center w-10 h-10 rounded text-[var(--color-ink)] hover:bg-[#ebe7df]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="lg:hidden border-t border-[var(--color-border)] px-6 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`no-underline px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/eventos"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-4 py-3 rounded text-[13px] font-semibold no-underline hover:bg-[var(--color-accent)] hover:text-white"
          >
            Agenda
          </Link>
        </nav>
      )}

      <div
        className="h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.62 0.17 45) 0%, oklch(0.62 0.17 45) 22%, #171b26 22%, #171b26 46%, #e3ded4 46%)",
        }}
      />
    </header>
  );
}
