import { ArticleBlock } from '@/src/types/strapi';
import { RichText } from './blocks/RichText';
import { Quote } from './blocks/Quote';
import { MediaBlock } from './blocks/MediaBlock';
import { SliderBlock } from './blocks/SliderBlock';

export function Blocks({ blocks }: { blocks: ArticleBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full px-6 py-12">
      {blocks.map((block) => {
        switch (block.__component) {
          case 'shared.rich-text':
            return <RichText key={block.id} block={block} />;
          case 'shared.quote':
            return <Quote key={block.id} block={block} />;
          case 'shared.media':
            return <MediaBlock key={block.id} block={block} />;
          case 'shared.slider':
            return <SliderBlock key={block.id} block={block} />;
          default:
            console.warn(`Block type not supported: ${(block as { __component?: string }).__component}`);
            return null;
        }
      })}
    </div>
  );
}
