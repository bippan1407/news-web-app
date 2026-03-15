import type { Article } from "#shared/types/news";

export function buildArticleSchema(
  article: Article,
  siteUrl: string,
): Record<string, unknown> {
  const datePublished = new Date(
    article.pubDate.replace(" ", "T"),
  ).toISOString();
  const url = `${siteUrl}/news/${articleSlug(article.title, article.article_id)}`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished,
    dateModified: datePublished,
    inLanguage: article.language,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      name: article.source_name,
      url: article.source_url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${siteUrl}${SITE_LOGO_PATH}` },
    },
  };

  if (article.description) schema.description = article.description;
  if (article.image_url) schema.image = article.image_url;

  return schema;
}

export function buildItemListSchema(
  articles: Article[],
  siteUrl: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/news/${articleSlug(article.title, article.article_id)}`,
      name: article.title,
    })),
  };
}
