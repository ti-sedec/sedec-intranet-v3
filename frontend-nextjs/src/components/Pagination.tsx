"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  const buttonClass =
    "no-underline font-mono text-[11px] font-semibold uppercase tracking-[0.1em] border border-[var(--color-border-strong-2)] rounded px-4 py-2.5 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]";

  return (
    <div className="flex items-center justify-center gap-3">
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} className={buttonClass}>
          ← Anterior
        </Link>
      ) : (
        <span className={`${buttonClass} opacity-40 pointer-events-none`}>← Anterior</span>
      )}

      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2.5 rounded bg-[var(--color-ink)] text-white">
        {currentPage} / {pageCount}
      </div>

      {currentPage < pageCount ? (
        <Link href={getPageUrl(currentPage + 1)} className={buttonClass}>
          Próxima →
        </Link>
      ) : (
        <span className={`${buttonClass} opacity-40 pointer-events-none`}>Próxima →</span>
      )}
    </div>
  );
}
