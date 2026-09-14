import type { ArticleBlock, RichTextBlock } from "@/src/types/strapi";

const WORDS_PER_MINUTE = 200;

function richTextBlocks(blocks: ArticleBlock[] | undefined): RichTextBlock[] {
  if (!blocks) return [];
  return blocks.filter((b): b is RichTextBlock => b.__component === "shared.rich-text");
}

function wordCount(text: string): number {
  const stripped = text.replace(/[#>*`_[\]()!-]/g, " ");
  return stripped.split(/\s+/).filter(Boolean).length;
}

export function readingTime(blocks: ArticleBlock[] | undefined): string {
  const words = richTextBlocks(blocks).reduce((sum, b) => sum + wordCount(b.body), 0);
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min`;
}

export interface HeadingItem {
  n: string;
  label: string;
}

export function headings(blocks: ArticleBlock[] | undefined): HeadingItem[] {
  const items: HeadingItem[] = [];
  for (const block of richTextBlocks(blocks)) {
    const match = block.body.match(/^#{1,3}\s+(.+)$/m);
    if (match) {
      items.push({ n: String(items.length + 1).padStart(2, "0"), label: match[1].trim() });
    }
  }
  return items;
}

export function stepsCount(blocks: ArticleBlock[] | undefined): number {
  const count = headings(blocks).length;
  return count > 0 ? count : richTextBlocks(blocks).length;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function hostFromUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const MONTHS_PT = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function monthLabel(date: Date = new Date()): string {
  return MONTHS_PT[date.getMonth()];
}
