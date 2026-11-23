"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Pagination from "@/src/components/Pagination";
import { normalizeText } from "@/src/lib/format";
import type { Painel } from "@/src/types/strapi";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 250;

export default function PaineisList({ paineis }: { paineis: Painel[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);

  // O input tem estado próprio para não "travar" a digitação; a URL é atualizada com debounce.
  const [text, setText] = useState(query);
  useEffect(() => setText(query), [query]);

  const updateUrl = (q: string, page: number) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (text.trim() === query.trim()) return;
    const t = setTimeout(() => updateUrl(text, 1), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const filtered = useMemo(() => {
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return paineis;
    return paineis.filter((p) => {
      const haystack = normalizeText(`${p.setor} ${p.tema} ${p.resumo ?? ""}`);
      return terms.every((term) => haystack.includes(term));
    });
  }, [paineis, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (page: number) => {
    updateUrl(query, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="relative max-w-[520px] mb-3">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-faint)] pointer-events-none" />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar por setor, tema ou resumo…"
          aria-label="Buscar painéis"
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded pl-10 pr-10 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-faint)] outline-none focus:border-[var(--color-accent)] [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText("");
              updateUrl("", 1);
            }}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-7 h-7 rounded text-[var(--color-faint)] hover:text-[var(--color-ink)] hover:bg-[#ebe7df]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-faint)] mt-0 mb-5" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "painel" : "painéis"}
        {query.trim() && ` para "${query.trim()}"`}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-muted)]">
          {query.trim() ? "Nenhum painel encontrado para essa busca." : "Nenhum painel cadastrado no momento."}
        </div>
      ) : (
        <>
          <div className="grid gap-4.5 mb-10" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
            {visible.map((p) => (
              <article
                key={p.id}
                className="text-[var(--color-ink)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md p-5.5 flex flex-col gap-2.5 min-w-0 hover:border-[var(--color-accent)]"
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-faint-2)]">
                  {p.setor}
                </span>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-lg leading-tight tracking-[-0.4px] m-0">
                  {p.tema}
                </h3>
                {p.resumo && <p className="text-sm leading-relaxed text-[var(--color-muted)] m-0">{p.resumo}</p>}
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto self-start inline-flex items-center gap-2 bg-[var(--color-ink)] text-white px-4 py-2.5 rounded text-[13px] font-semibold no-underline hover:bg-[var(--color-accent)] hover:text-white"
                >
                  Abrir painel <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>

          <Pagination currentPage={currentPage} pageCount={pageCount} basePath={pathname} onPageChange={handlePageChange} />
        </>
      )}
    </>
  );
}
