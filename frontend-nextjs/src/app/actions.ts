"use server";

import { fetchArticles } from "@/src/lib/strapi";

export async function getLatestArticles(page: number, excludeId: number, pageSize: number) {
  return fetchArticles({ page, pageSize, excludeId });
}
