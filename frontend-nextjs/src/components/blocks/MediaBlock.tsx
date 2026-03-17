import Image from 'next/image';
import { MediaBlock as MediaBlockType } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';
import { BlockReveal } from './BlockReveal';

export function MediaBlock({ block }: { block: MediaBlockType }) {
  const imageUrl = getStrapiMedia(block.file.url);
  if (!imageUrl) return null;

  return (
    <BlockReveal>
      <figure className="my-10 w-full overflow-hidden brutalist-border">
        <Image
          src={imageUrl}
          alt={block.file.alternativeText || block.file.name || 'Image'}
          width={block.file.width || 1200}
          height={block.file.height || 800}
          className="w-full h-auto object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />
        {block.file.caption && (
          <figcaption className="p-3 bg-slate-50 text-sm font-mono text-slate-600 dark:bg-slate-900 dark:text-slate-400 uppercase tracking-wider border-t-2 border-slate-900 dark:border-slate-100">
            {block.file.caption}
          </figcaption>
        )}
      </figure>
    </BlockReveal>
  );
}
