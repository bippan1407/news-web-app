import { describe, expect, it } from "vitest";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const articles = dummyData.list.results as Article[];
// Article with all optional fields present (keywords, creator, image, description)
const fullArticle = articles.find(
  (a) => a.article_id === "8104cd70aadcbfdb829b5f79fe4f2949",
)!;

const siteUrl = "https://news-by-justlife.vercel.app";

describe("buildArticleSchema", () => {
  it("returns valid Article schema structure", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Article");
    expect(schema.headline).toBe(fullArticle.title);
    expect(schema.inLanguage).toBe("english");
  });

  it("converts pubDate to ISO format", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);
    const expected = new Date(
      fullArticle.pubDate.replace(" ", "T"),
    ).toISOString();

    expect(schema.datePublished).toBe(expected);
    expect(schema.dateModified).toBe(expected);
  });

  it("builds author from source fields as Organization", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);
    const author = schema.author as Record<string, unknown>;

    expect(author["@type"]).toBe("Organization");
    expect(author.name).toBe("Times Now News");
    expect(author.url).toBe("https://www.timesnownews.com");
  });

  it("builds publisher as site Organization", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);
    const publisher = schema.publisher as Record<string, unknown>;

    expect(publisher["@type"]).toBe("Organization");
    expect(publisher.name).toBe(SITE_NAME);
    expect(publisher.logo).toEqual({
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
    });
  });

  it("includes description when present", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);

    expect(schema.description).toBe(fullArticle.description);
  });

  it("excludes description when null", () => {
    const article = { ...fullArticle, description: null };
    const schema = buildArticleSchema(article, siteUrl);

    expect(schema).not.toHaveProperty("description");
  });

  it("includes image_url when present", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);

    expect(schema.image).toBe(fullArticle.image_url);
  });

  it("excludes image when null", () => {
    const article = { ...fullArticle, image_url: null };
    const schema = buildArticleSchema(article, siteUrl);

    expect(schema).not.toHaveProperty("image");
  });

  it("includes mainEntityOfPage with generated url", () => {
    const schema = buildArticleSchema(fullArticle, siteUrl);
    const expectedUrl = `${siteUrl}/news/${articleSlug(fullArticle.title, fullArticle.article_id)}`;

    expect(schema.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": expectedUrl,
    });
  });
});
