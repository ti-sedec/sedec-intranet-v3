"use server";

import { fetchComunicadoById } from "@/src/lib/strapi";

/**
 * Server Action to fetch full details of a Comunicado by its documentId.
 * This is used by the Client Component (ComunicadosFeed) to load data dynamically
 * into the dialog modal without exposing the internal Strapi URLs.
 */
export async function getComunicadoDetails(documentId: string) {
  try {
    const data = await fetchComunicadoById(documentId);
    return data;
  } catch (error) {
    console.error(`Failed to execute getComunicadoDetails for ${documentId}:`, error);
    return null;
  }
}
