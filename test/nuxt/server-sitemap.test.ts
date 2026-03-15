import { describe, expect, it } from "vitest";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const articles = dummyData.list.results as Article[];

function buildSitemapEntry(article: Article) {
  return {
    loc: `/news/${articleSlug(article.title, article.article_id)}`,
    lastmod: new Date(article.pubDate.replace(" ", "T")).toISOString(),
    changefreq: "never",
    priority: 0.7,
    images: article.image_url ? [{ loc: article.image_url }] : [],
  };
}

describe("sitemap entry generation", () => {
  it("generates entries for all articles", () => {
    const entries = articles.map(buildSitemapEntry);

    expect(entries).toHaveLength(articles.length);
  });

  it("each entry has required sitemap fields", () => {
    const entry = buildSitemapEntry(articles[0]);

    expect(entry).toHaveProperty("loc");
    expect(entry).toHaveProperty("lastmod");
    expect(entry).toHaveProperty("changefreq", "never");
    expect(entry).toHaveProperty("priority", 0.7);
    expect(entry).toHaveProperty("images");
  });

  it("loc starts with /news/ and contains article id", () => {
    const entry = buildSitemapEntry(articles[0]);

    expect(entry.loc).toMatch(/^\/news\//);
    expect(entry.loc).toContain(articles[0].article_id);
  });

  it("lastmod is a valid ISO date", () => {
    const entry = buildSitemapEntry(articles[0]);
    const date = new Date(entry.lastmod);

    expect(date.toISOString()).toBe(entry.lastmod);
  });

  it("includes image when article has image_url", () => {
    const articleWithImage = articles.find((a) => a.image_url !== null)!;
    const entry = buildSitemapEntry(articleWithImage);

    expect(entry.images).toHaveLength(1);
    expect(entry.images[0].loc).toBe(articleWithImage.image_url);
  });

  it("has empty images array when no image_url", () => {
    const articleData = { ...articles[0], image_url: null };
    const entry = buildSitemapEntry(articleData);

    expect(entry.images).toHaveLength(0);
  });

  it("loc uses slugified title", () => {
    const entry = buildSitemapEntry(articles[3]); // English article
    const expectedSlug = articleSlug(articles[3].title, articles[3].article_id);

    expect(entry.loc).toBe(`/news/${expectedSlug}`);
  });
});
