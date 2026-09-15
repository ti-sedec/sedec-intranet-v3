import ReactMarkdown from 'react-markdown';
import { RichTextBlock } from '@/src/types/strapi';

export function RichText({ block }: { block: RichTextBlock }) {
  return (
    <div
      className="prose prose-lg max-w-none break-words prose-headings:font-[family-name:var(--font-display)] prose-headings:font-bold prose-headings:tracking-[-0.5px] prose-headings:text-[var(--color-ink)] prose-p:text-[var(--color-body)] prose-p:leading-[1.68] prose-a:text-[var(--color-link)] prose-pre:overflow-x-auto prose-table:block prose-table:overflow-x-auto prose-table:max-w-full"
    >
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </div>
  );
}
