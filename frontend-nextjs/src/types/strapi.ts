export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
}

export interface RichTextBlock {
  __component: 'shared.rich-text';
  id: number;
  body: string;
}

export interface QuoteBlock {
  __component: 'shared.quote';
  id: number;
  title: string;
  body: string;
  atribuicao?: string;
}

export interface MediaBlock {
  __component: 'shared.media';
  id: number;
  file: StrapiImage;
}

export interface SliderBlock {
  __component: 'shared.slider';
  id: number;
  files: StrapiImage[];
}

export type ArticleBlock = RichTextBlock | QuoteBlock | MediaBlock | SliderBlock;

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
}

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  cover: StrapiImage | null;
  author?: Author;
  category?: Category;
  blocks?: ArticleBlock[];
}

export interface Tutorial {
  id: number;
  documentId: string;
  titulo: string;
  slug: string;
  grupo: string | null;
  descricao: string;
  publishedAt: string;
  conteudo?: ArticleBlock[];
}

export interface LinkUtil {
  id: number;
  documentId: string;
  titulo: string;
  grupo: string | null;
  descricao: string | null;
  url: string;
}

export interface Aniversariante {
  id: number;
  documentId: string;
  nome: string;
  dataAniversario: string;
  unidade: string | null;
}

export interface About {
  id: number;
  documentId: string;
  title: string;
  blocks?: ArticleBlock[];
}

export interface GlobalSettings {
  siteName: string;
  siteDescription: string;
  agendaUrl: string | null;
  contatoRamal: string | null;
  contatoEmail: string | null;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}
