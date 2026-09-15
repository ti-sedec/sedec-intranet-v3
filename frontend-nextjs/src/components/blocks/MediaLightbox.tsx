"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { StrapiImage } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';

export function MediaLightbox({ media, onClose }: { media: StrapiImage | null; onClose: () => void }) {
  useEffect(() => {
    if (!media) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, onClose]);

  if (!media) return null;

  const mediaUrl = getStrapiMedia(media.url);
  if (!mediaUrl) return null;

  const isVideo = media.mime?.startsWith('video/');

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-8"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-[var(--color-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        onClick={onClose}
        type="button"
        title="Fechar"
      >
        <span className="sr-only">Fechar</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="scroll-dark flex max-h-[90vh] max-w-[min(1100px,92vw)] flex-col items-center overflow-y-auto rounded-md bg-[var(--color-ink)]"
        onClick={(e) => e.stopPropagation()}
      >
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="block max-h-[80vh] w-auto max-w-full object-contain"
          />
        ) : (
          <Image
            src={mediaUrl}
            alt={media.alternativeText || media.name || 'Imagem ampliada'}
            width={media.width || 1920}
            height={media.height || 1080}
            className="block max-h-[80vh] max-w-full w-auto h-auto object-contain"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        )}
        {media.caption && (
          <div className="w-full shrink-0 bg-white text-[var(--color-ink)] px-6 py-4 text-sm text-center">
            {media.caption}
          </div>
        )}
      </div>
    </div>
  );
}
