import { QuoteBlock } from '@/src/types/strapi';
import { BlockReveal } from './BlockReveal';

export function Quote({ block }: { block: QuoteBlock }) {
  return (
    <BlockReveal>
      <blockquote className="border-l-4 border-slate-900 dark:border-slate-100 pl-6 py-4 my-8 bg-slate-50 dark:bg-slate-900/50">
        <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 leading-snug">
          &quot;{block.body}&quot;
        </p>
        {block.title && (
          <footer className="mt-4 text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
            — {block.title}
          </footer>
        )}
      </blockquote>
    </BlockReveal>
  );
}
