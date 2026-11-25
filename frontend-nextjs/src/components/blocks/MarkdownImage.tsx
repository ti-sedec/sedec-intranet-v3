"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { getStrapiMedia } from "@/src/lib/strapi";
import { MediaLightbox } from "./MediaLightbox";

type Props = { src?: string | Blob; alt?: string };

/**
 * Imagem inserida no editor markdown do Strapi (rich-text).
 * - URLs `/uploads/...` (relativas, da Media Library) recebem a URL pública do Strapi;
 *   URLs absolutas e demais caminhos passam sem alteração.
 * - Clique amplia a imagem no lightbox.
 */
export function MarkdownImage({ src, alt }: Props) {
  const [open, setOpen] = useState(false);
  if (typeof src !== "string" || !src) return null;

  const url = src.startsWith("/uploads/") ? getStrapiMedia(src) : src;
  if (!url) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Clique para ampliar"
        className="block w-full cursor-zoom-in overflow-hidden rounded-[5px] border border-[var(--color-border)] bg-white p-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt ?? ""} loading="lazy" className="block w-full h-auto m-0" />
      </button>
      {open &&
        createPortal(
          <MediaLightbox
            media={{ id: 0, documentId: "", url, alternativeText: alt }}
            onClose={() => setOpen(false)}
          />,
          document.body
        )}
    </>
  );
}
