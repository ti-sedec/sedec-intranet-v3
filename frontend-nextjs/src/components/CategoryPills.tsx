"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/src/types/strapi";

export function CategoryPills({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("categoria");

  const select = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/noticias?${qs}` : "/noticias");
  };

  const pills: { label: string; slug: string | null }[] = [
    { label: "Todas", slug: null },
    ...categories.map((c) => ({ label: c.name, slug: c.slug })),
  ];

  return (
    <div className="flex gap-2 flex-wrap pb-5 border-b border-[var(--color-border-strong)] mb-8">
      {pills.map((pill) => {
        const isActive = active === pill.slug || (!active && pill.slug === null);
        return (
          <button
            key={pill.label}
            type="button"
            onClick={() => select(pill.slug)}
            className={`font-mono text-[11px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full border ${
              isActive
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                : "bg-transparent text-[var(--color-ink-soft)] border-[var(--color-border-strong-2)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
