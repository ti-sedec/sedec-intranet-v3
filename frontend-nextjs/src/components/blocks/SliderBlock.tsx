"use client";

import Image from 'next/image';
import { SliderBlock as SliderBlockType, StrapiImage } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';
import { BlockReveal } from './BlockReveal';

export function SliderBlock({ block }: { block: SliderBlockType }) {
  if (!block.files || block.files.length === 0) return null;

  return (
    <BlockReveal>
      <div className="w-full overflow-x-auto pb-6 my-10 snap-x snap-mandatory flex gap-6 scrollbar-thin">
        {block.files.map((file: StrapiImage) => {
          const imageUrl = getStrapiMedia(file.url);
          if (!imageUrl) return null;
          return (
            <figure key={file.id} className="min-w-[85vw] md:min-w-[60vw] snap-center shrink-0 brutalist-border bg-white dark:bg-slate-950">
              <Image
                src={imageUrl}
                alt={file.alternativeText || file.name || 'Slider image'}
                width={file.width || 800}
                height={file.height || 600}
                className="w-full h-[60vh] object-cover"
              />
              {file.caption && (
                <figcaption className="p-3 bg-slate-50 text-xs font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400 uppercase tracking-wider border-t-2 border-slate-900 dark:border-slate-100">
                  {file.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </BlockReveal>
  );
}
