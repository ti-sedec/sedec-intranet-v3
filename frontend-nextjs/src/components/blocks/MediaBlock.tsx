import Image from 'next/image';
import { MediaBlock as MediaBlockType } from '@/src/types/strapi';
import { getStrapiMedia } from '@/src/lib/strapi';

export function MediaBlock({ block }: { block: MediaBlockType }) {
  const imageUrl = getStrapiMedia(block.file.url);
  if (!imageUrl) return null;

  return (
    <figure className="m-0">
      <div className="relative w-full rounded-[5px] overflow-hidden border border-[var(--color-border)]" style={{ aspectRatio: "16/9" }}>
        <Image
          src={imageUrl}
          alt={block.file.alternativeText || block.file.name || 'Imagem'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
        />
      </div>
      {block.file.caption && (
        <figcaption className="mt-2.5 text-[13px] text-[var(--color-faint)] leading-relaxed">
          {block.file.caption}
        </figcaption>
      )}
    </figure>
  );
}
