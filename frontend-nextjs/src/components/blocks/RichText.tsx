import ReactMarkdown from 'react-markdown';
import { RichTextBlock } from '@/src/types/strapi';
import { BlockReveal } from './BlockReveal';

export function RichText({ block }: { block: RichTextBlock }) {
  return (
    <BlockReveal>
      <div className="prose prose-lg dark:prose-invert prose-slate max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-img:rounded-none">
        <ReactMarkdown>{block.body}</ReactMarkdown>
      </div>
    </BlockReveal>
  );
}
