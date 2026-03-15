import type { NewsListApiResponse } from "#shared/types/news";
import { articleSlug } from "#shared/utils/slugify";

const MAX_PAGES = 1;

export default defineEventHandler(async () => {
  const urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: number;
    images: { loc: string }[];
  }> = [];

  let cursor: string | undefined = undefined;
  let page = 0;

  do {
    const data: NewsListApiResponse = await $fetch<NewsListApiResponse>(
      "/api/news",
      {
        query: cursor ? { cursor } : {},
      },
    );

    for (const article of data.results) {
      urls.push({
        loc: `/news/${articleSlug(article.title, article.article_id)}`,
        lastmod: new Date(article.pubDate.replace(" ", "T")).toISOString(),
        changefreq: "never",
        priority: 0.7,
        images: article.image_url ? [{ loc: article.image_url }] : [],
      });
    }

    cursor = data.nextPage ?? undefined;
    page++;
  } while (cursor && page < MAX_PAGES);

  return urls;
});
