"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  basePath: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  const buttonClass =
    "no-underline font-mono text-[11px] font-semibold uppercase tracking-[0.1em] border border-[var(--color-border-strong-2)] rounded px-4 py-2.5 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]";

  const renderNav = (page: number, disabled: boolean, label: string) => {
    if (disabled) {
      return <span className={`${buttonClass} opacity-40 pointer-events-none`}>{label}</span>;
    }

    if (onPageChange) {
      return (
        <button type="button" onClick={() => onPageChange(page)} className={buttonClass}>
          {label}
        </button>
      );
    }

    return (
      <Link href={getPageUrl(page)} className={buttonClass}>
        {label}
      </Link>
    );
  };

  return (
    <div className="flex items-center justify-center gap-3">
      {renderNav(currentPage - 1, currentPage <= 1, "← Anterior")}

      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2.5 rounded bg-[var(--color-ink)] text-white">
        {currentPage} / {pageCount}
      </div>

      {renderNav(currentPage + 1, currentPage >= pageCount, "Próxima →")}
    </div>
  );
}
