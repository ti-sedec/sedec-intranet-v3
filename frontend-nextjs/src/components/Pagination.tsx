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

  // Function to build URL properly depending on existing search params
  const getPageUrl = (page: number) => {
    // If basePath already contains a '?', use '&' instead
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
        >
          ← Anterior
        </Link>
      )}

      <div className="brutalist-border px-6 py-3 font-bold bg-[#0f1115] text-white">
        {currentPage} / {pageCount}
      </div>

      {currentPage < pageCount && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="brutalist-border px-6 py-3 font-bold uppercase tracking-widest hover:bg-[rgb(25,50,130)] hover:text-white transition-colors"
        >
          Próxima →
        </Link>
      )}
    </div>
  );
}
