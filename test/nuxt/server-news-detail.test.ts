import { describe, expect, it } from "vitest";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const detailKey = "8104cd70aadcbfdb829b5f79fe4f2949" as keyof typeof dummyData;
const detailData = dummyData[detailKey];
const article = detailData.results[0] as Article;

describe("news detail response transformation", () => {
  it("detail response contains a single article", () => {
    expect(detailData.results).toHaveLength(1);
  });

  it("article has all required fields", () => {
    expect(article).toHaveProperty("article_id");
    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("description");
    expect(article).toHaveProperty("link");
    expect(article).toHaveProperty("pubDate");
    expect(article).toHaveProperty("source_name");
    expect(article).toHaveProperty("image_url");
  });

  it("article_id matches the lookup key", () => {
    expect(article.article_id).toBe(detailKey);
  });

  it("nextPage is null for single article lookup", () => {
    expect(detailData.nextPage).toBeNull();
  });

  it("totalResults is 1 for single article", () => {
    expect(detailData.totalResults).toBe(1);
  });

  it("article slug can be generated from title and id", () => {
    const slug = articleSlug(article.title, article.article_id);

    expect(slug).toContain(article.article_id);
    expect(articleIdFromSlug(slug)).toBe(article.article_id);
  });
});
