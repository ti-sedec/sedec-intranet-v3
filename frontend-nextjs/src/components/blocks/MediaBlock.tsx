"use client";

import { useState } from 'react';
import Image from 'next/image';
import { MediaBlock as MediaBlockType } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';
import { MediaLightbox } from './MediaLightbox';

export function MediaBlock({ block }: { block: MediaBlockType }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mediaUrl = getStrapiMedia(block.file.url);
  if (!mediaUrl) return null;

  const isVideo = block.file.mime?.startsWith('video/');

  return (
    <figure className="m-0">
      <div
        className="relative w-full cursor-pointer rounded-[5px] overflow-hidden border border-[var(--color-border)]"
        style={{ aspectRatio: "16/9" }}
        onClick={() => setLightboxOpen(true)}
      >
        {isVideo ? (
          <video
            src={mediaUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <Image
            src={mediaUrl}
            alt={block.file.alternativeText || block.file.name || 'Imagem'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          />
        )}
        {isVideo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
        )}
      </div>
      {block.file.caption && (
        <figcaption className="mt-2.5 text-[13px] text-[var(--color-faint)] leading-relaxed">
          {block.file.caption}
        </figcaption>
      )}

      {lightboxOpen && (
        <MediaLightbox media={block.file} onClose={() => setLightboxOpen(false)} />
      )}
    </figure>
  );
}
