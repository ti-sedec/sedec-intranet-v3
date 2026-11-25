"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/noticias", label: "Notícias" },
];

const INFO_LINKS = [
  { href: "/tutoriais", label: "Tutoriais" },
  { href: "/paineis", label: "Painéis" },
];

const ABOUT_LINK = { href: "/sobre", label: "Sobre" };

const TOOLS_LINKS = [
  { href: "/links-uteis", label: "Links úteis" },
  { href: "/utilidades/qrcode", label: "Gerador de QR Code" },
];

const DROPDOWN_MOTION = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
};

/** Sublinhado que desliza entre os itens ativos do menu ao navegar. */
function ActiveUnderline() {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute left-[13px] right-[13px] bottom-[3px] h-[2px] rounded-full bg-[var(--color-accent)]"
      transition={{ type: "spring", stiffness: 500, damping: 38 }}
    />
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const toolsActive = TOOLS_LINKS.some((l) => pathname === l.href);
  const infoActive = INFO_LINKS.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setToolsOpen(false);
    setInfoOpen(false);
  }

  useEffect(() => {
    if (!toolsOpen && !infoOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false);
      if (!infoRef.current?.contains(e.target as Node)) setInfoOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setToolsOpen(false);
        setInfoOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen, infoOpen]);

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
                className={`relative no-underline px-[13px] py-[9px] rounded text-sm font-medium transition-colors duration-150 hover:bg-[#ebe7df] ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                }`}
              >
                {link.label}
                {isActive && <ActiveUnderline />}
              </Link>
            );
          })}
          <div ref={infoRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setInfoOpen((v) => !v);
                setToolsOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={infoOpen}
              className={`relative inline-flex items-center gap-1 px-[13px] py-[9px] rounded text-sm font-medium transition-colors duration-150 hover:bg-[#ebe7df] ${
                infoActive || infoOpen ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
              }`}
            >
              Informações
              <ChevronDown size={14} className={`transition-transform duration-200 ${infoOpen ? "rotate-180" : ""}`} />
              {infoActive && <ActiveUnderline />}
            </button>
            <AnimatePresence>
            {infoOpen && (
              <motion.div
                {...DROPDOWN_MOTION}
                role="menu"
                className="absolute right-0 top-full mt-1 min-w-[180px] bg-[var(--color-bg)] border border-[var(--color-border)] border-t-2 border-t-[var(--color-accent)] rounded shadow-lg py-1 z-50"
              >
                {INFO_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setInfoOpen(false)}
                    className={`block no-underline px-4 py-2.5 text-sm font-medium hover:bg-[#ebe7df] ${
                      pathname === link.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setToolsOpen((v) => !v);
                setInfoOpen(false);
              }}
              aria-haspopup="menu"
              aria-expanded={toolsOpen}
              className={`relative inline-flex items-center gap-1 px-[13px] py-[9px] rounded text-sm font-medium transition-colors duration-150 hover:bg-[#ebe7df] ${
                toolsActive || toolsOpen ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
              }`}
            >
              Utilidades
              <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              {toolsActive && <ActiveUnderline />}
            </button>
            <AnimatePresence>
            {toolsOpen && (
              <motion.div
                {...DROPDOWN_MOTION}
                role="menu"
                className="absolute right-0 top-full mt-1 min-w-[180px] bg-[var(--color-bg)] border border-[var(--color-border)] border-t-2 border-t-[var(--color-accent)] rounded shadow-lg py-1 z-50"
              >
                {TOOLS_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setToolsOpen(false)}
                    className={`block no-underline px-4 py-2.5 text-sm font-medium hover:bg-[#ebe7df] ${
                      pathname === link.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
          <Link
            href={ABOUT_LINK.href}
            className={`relative no-underline px-[13px] py-[9px] rounded text-sm font-medium transition-colors duration-150 hover:bg-[#ebe7df] ${
              pathname === ABOUT_LINK.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
            }`}
          >
            {ABOUT_LINK.label}
            {pathname === ABOUT_LINK.href && <ActiveUnderline />}
          </Link>
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

      <AnimatePresence initial={false}>
      {open && (
        <motion.nav
          id="mobile-nav"
          initial={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
          animate={{ height: "auto", opacity: 1, paddingTop: 12, paddingBottom: 12 }}
          exit={{ height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden overflow-hidden border-t border-[var(--color-border)] px-6 py-3 flex flex-col gap-1"
        >
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
          <details className="group">
            <summary
              className={`list-none cursor-pointer flex items-center justify-between px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
                infoActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
              }`}
            >
              Informações
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-3 pl-3 border-l-2 border-[var(--color-accent)] flex flex-col">
              {INFO_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`no-underline px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
                    pathname === link.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
          <details className="group">
            <summary
              className={`list-none cursor-pointer flex items-center justify-between px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
                toolsActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
              }`}
            >
              Utilidades
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="ml-3 pl-3 border-l-2 border-[var(--color-accent)] flex flex-col">
              {TOOLS_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`no-underline px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
                    pathname === link.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
          <Link
            href={ABOUT_LINK.href}
            onClick={() => setOpen(false)}
            className={`no-underline px-3 py-3 rounded text-sm font-medium hover:bg-[#ebe7df] ${
              pathname === ABOUT_LINK.href ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
            }`}
          >
            {ABOUT_LINK.label}
          </Link>
          <Link
            href="/eventos"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-white px-4 py-3 rounded text-[13px] font-semibold no-underline hover:bg-[var(--color-accent)] hover:text-white"
          >
            Agenda
          </Link>
        </motion.nav>
      )}
      </AnimatePresence>

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
