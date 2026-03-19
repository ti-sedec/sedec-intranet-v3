export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchLatestArticle() {
  const query = new URLSearchParams({
    'pagination[page]': '1',
    'pagination[pageSize]': '1',
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'description',
    'fields[3]': 'publishedAt',
    'populate[cover][fields][0]': 'id',
    'populate[cover][fields][1]': 'documentId',
    'populate[cover][fields][2]': 'url',
    'populate[cover][fields][3]': 'formats',
    'populate[cover][fields][4]': 'alternativeText',
    'sort[0]': 'publishedAt:desc',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch latest article');
  }

  const json = await res.json();
  return json.data?.length > 0 ? json.data[0] : null;
}

export async function fetchArticles(page = 1, pageSize = 9, excludeId?: number) {
  const params: Record<string, string> = {
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'fields[0]': 'title',
    'fields[1]': 'slug',
    'fields[2]': 'description',
    'fields[3]': 'publishedAt',
    'populate[cover][fields][0]': 'id',
    'populate[cover][fields][1]': 'documentId',
    'populate[cover][fields][2]': 'url',
    'populate[cover][fields][3]': 'formats',
    'populate[cover][fields][4]': 'alternativeText',
    'sort[0]': 'publishedAt:desc',
  };

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

export async function fetchArticleBySlug(slug: string) {
  const query = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate[blocks][on][shared.rich-text][populate]': '*',
    'populate[blocks][on][shared.quote][populate]': '*',
    'populate[blocks][on][shared.media][populate]': '*',
    'populate[blocks][on][shared.slider][populate]': '*',
    'populate[cover][fields][0]': 'url',
    'populate[author][fields][1]': '*',
    'populate[category][fields][2]': '*',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/articles?${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch article (slug: ${slug})`);
  }

  const json = await res.json();
  const articles = json.data;
  return articles.length > 0 ? articles[0] : null;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}

export async function fetchGlobalAgendaUrl() {
  const query = new URLSearchParams({
    'fields': 'agendaUrl',
  }).toString();

  const res = await fetch(`${STRAPI_URL}/api/global?${query}`, {
    cache: 'no-store', // Always fetch latest for agenda per user request, or use revalidate. Let's not cache it heavily if they expect real-time URL updates, or use revalidate 60.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('Failed to fetch global agenda url');
    return null;
  }

  const json = await res.json();
  return json.data?.agendaUrl || null;
}
