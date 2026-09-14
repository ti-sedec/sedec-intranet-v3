import type {
  About,
  Aniversariante,
  Article,
  Category,
  GlobalSettings,
  LinkUtil,
  StrapiResponse,
  Tutorial,
} from '@/src/types/strapi';

export const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const BLOCKS_POPULATE = {
  'populate[blocks][on][shared.rich-text][populate]': '*',
  'populate[blocks][on][shared.quote][populate]': '*',
  'populate[blocks][on][shared.media][populate]': '*',
  'populate[blocks][on][shared.slider][populate]': '*',
};

export function getStrapiMedia(url: string | null | undefined) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  const publicUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${publicUrl}${url}`;
}

export async function fetchArticles(options: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  excludeId?: number;
} = {}): Promise<StrapiResponse<Article[]>> {
  const { page = 1, pageSize = 9, categorySlug, excludeId } = options;

  const params: Record<string, string> = {
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'description',
    'fields[3]': 'publishedAt',
    'populate[cover][fields][0]': 'url',
    'populate[cover][fields][1]': 'formats',
    'populate[cover][fields][2]': 'alternativeText',
    'populate[author][fields][0]': 'name',
    'populate[category][fields][0]': 'name',
    'populate[category][fields][1]': 'slug',
    ...BLOCKS_POPULATE,
    'sort[0]': 'publishedAt:desc',
  };

  if (categorySlug) {
    params['filters[category][slug][$eq]'] = categorySlug;
  }

  if (excludeId) {
    params['filters[id][$ne]'] = excludeId.toString();
  }

  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  return res.json();
}

export async function fetchLatestArticle(): Promise<Article | null> {
  const { data } = await fetchArticles({ page: 1, pageSize: 1 });
  return data.length > 0 ? data[0] : null;
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const query = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[cover][populate]': '*',
    'populate[author][populate]': '*',
    'populate[category][populate]': '*',
    ...BLOCKS_POPULATE,
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article (slug: ${slug})`);
  }

  const json = await res.json();
  const articles: Article[] = json.data;
  return articles.length > 0 ? articles[0] : null;
}

export async function fetchRelatedArticles(categorySlug: string | undefined, excludeId: number, limit = 3): Promise<Article[]> {
  if (!categorySlug) return [];
  const { data } = await fetchArticles({ page: 1, pageSize: limit, categorySlug, excludeId });
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const query = new URLSearchParams({
    'fields[0]': 'name',
    'fields[1]': 'slug',
    'pagination[pageSize]': '100',
    'sort[0]': 'name:asc',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/categories?${query}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchTutorials(): Promise<Tutorial[]> {
  const query = new URLSearchParams({
    'pagination[pageSize]': '100',
    'sort[0]': 'publishedAt:desc',
    'populate[conteudo][on][shared.rich-text][populate]': '*',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/tutoriais?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchTutorialBySlug(slug: string): Promise<Tutorial | null> {
  const query = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[conteudo][on][shared.rich-text][populate]': '*',
    'populate[conteudo][on][shared.quote][populate]': '*',
    'populate[conteudo][on][shared.media][populate]': '*',
    'populate[conteudo][on][shared.slider][populate]': '*',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/tutoriais?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tutorial (slug: ${slug})`);
  }

  const json = await res.json();
  const tutorials: Tutorial[] = json.data;
  return tutorials.length > 0 ? tutorials[0] : null;
}

export async function fetchLinksUteis(): Promise<LinkUtil[]> {
  const query = new URLSearchParams({
    'pagination[pageSize]': '100',
    'sort[0]': 'grupo:asc',
    'sort[1]': 'titulo:asc',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/links-uteis?${query}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  return json.data || [];
}

export async function fetchAniversariantesDoMes(referenceDate: Date = new Date()): Promise<Aniversariante[]> {
  const query = new URLSearchParams({
    'pagination[pageSize]': '200',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/aniversariantes?${query}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const json = await res.json();
  const all: Aniversariante[] = json.data || [];
  const month = referenceDate.getMonth();

  return all
    .filter((a) => {
      const d = new Date(a.dataAniversario);
      return d.getUTCMonth() === month;
    })
    .sort((a, b) => new Date(a.dataAniversario).getUTCDate() - new Date(b.dataAniversario).getUTCDate());
}

export async function fetchAbout(): Promise<About | null> {
  const query = new URLSearchParams({
    ...BLOCKS_POPULATE,
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/about?${query}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data || null;
}

export async function fetchGlobal(): Promise<GlobalSettings | null> {
  const query = new URLSearchParams({
    'fields[0]': 'siteName',
    'fields[1]': 'siteDescription',
    'fields[2]': 'agendaUrl',
    'fields[3]': 'contatoRamal',
    'fields[4]': 'contatoEmail',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/global?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // 404 é esperado quando o single type "Global" ainda não tem registro criado no Strapi.
    if (res.status !== 404) {
      console.error('Failed to fetch global settings');
    }
    return null;
  }

  const json = await res.json();
  return json.data || null;
}
