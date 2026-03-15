import { describe, expect, it } from "vitest";
import {
  slugify,
  articleSlug,
  articleIdFromSlug,
} from "../../shared/utils/slugify";

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces non-alphanumeric characters with hyphens", () => {
    expect(slugify("Breaking News: Economy & Markets!")).toBe(
      "breaking-news-economy-markets",
    );
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("articleSlug", () => {
  it("creates slug from title and id", () => {
    expect(articleSlug("Hello World", "abc123")).toBe("hello-world-abc123");
  });
});

describe("articleIdFromSlug", () => {
  it("extracts id from the end of slug", () => {
    expect(articleIdFromSlug("hello-world-abc123")).toBe("abc123");
  });

  it("returns the slug itself if no hyphens", () => {
    expect(articleIdFromSlug("abc123")).toBe("abc123");
  });
});
