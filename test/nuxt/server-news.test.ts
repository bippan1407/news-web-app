import { describe, expect, it } from "vitest";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const articles = dummyData.list.results as Article[];

describe("news list response transformation", () => {
  it("all articles have required fields", () => {
    for (const article of articles) {
      expect(article).toHaveProperty("article_id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("pubDate");
      expect(article).toHaveProperty("source_name");
      expect(article).toHaveProperty("language");
    }
  });

  it("articles have valid pubDate format", () => {
    for (const article of articles) {
      // pubDate format: "YYYY-MM-DD HH:MM:SS"
      expect(article.pubDate).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    }
  });

  it("nextPage is a string or null", () => {
    const nextPage = dummyData.list.nextPage;

    expect(typeof nextPage === "string" || nextPage === null).toBe(true);
  });

  it("totalResults is a positive number", () => {
    expect(dummyData.list.totalResults).toBeGreaterThan(0);
  });

  it("image_url is a string or null", () => {
    for (const article of articles) {
      expect(
        typeof article.image_url === "string" || article.image_url === null,
      ).toBe(true);
    }
  });

  it("keywords is an array or null", () => {
    for (const article of articles) {
      expect(Array.isArray(article.keywords) || article.keywords === null).toBe(
        true,
      );
    }
  });

  it("creator is an array or null", () => {
    for (const article of articles) {
      expect(Array.isArray(article.creator) || article.creator === null).toBe(
        true,
      );
    }
  });
});
