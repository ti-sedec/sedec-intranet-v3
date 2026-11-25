"use client";

import { useState, useTransition } from "react";
import { ArticleCard } from "@/src/components/ArticleCard";
import Pagination from "@/src/components/Pagination";
import { Reveal } from "@/src/components/motion/Reveal";
import { stagger } from "@/src/lib/motion";
import { getLatestArticles } from "@/src/app/actions";
import type { Article } from "@/src/types/strapi";

interface LatestNewsSectionProps {
  initialArticles: Article[];
  initialPage: number;
  initialPageCount: number;
  pageSize: number;
  excludeId: number;
}

export function LatestNewsSection({
  initialArticles,
  initialPage,
  initialPageCount,
  pageSize,
  excludeId,
}: LatestNewsSectionProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    startTransition(async () => {
      const { data, meta } = await getLatestArticles(newPage, excludeId, pageSize);
      setArticles(data);
      setPageCount(meta.pagination.pageCount);
      setPage(newPage);

      const url = new URL(window.location.href);
      if (newPage > 1) {
        url.searchParams.set("page", String(newPage));
      } else {
        url.searchParams.delete("page");
      }
      window.history.replaceState(window.history.state, "", url);
    });
  };

  return (
    <>
      <div
        className={`grid gap-6.5 transition-opacity ${isPending ? "opacity-50" : ""}`}
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))" }}
      >
        {articles.map((a, i) => (
          <Reveal key={`${page}-${a.id}`} delay={stagger(i, 0.07)} className="min-w-0">
            <ArticleCard article={a} variant="grid" />
          </Reveal>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            pageCount={pageCount}
            basePath="/"
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
