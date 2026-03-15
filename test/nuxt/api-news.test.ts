import { describe, expect, it } from "vitest";
import { registerEndpoint } from "@nuxt/test-utils/runtime";
import { fetchNewsList, fetchNewsDetail } from "../../app/api/news";
import dummyData from "../fixtures/dummy.json";

registerEndpoint("/api/news", () => ({
  results: dummyData.list.results,
  nextPage: dummyData.list.nextPage,
  totalResults: dummyData.list.totalResults,
}));

registerEndpoint("/api/news/abc123", () => ({
  article: dummyData.list.results[0],
}));

describe("fetchNewsList", () => {
  it("returns news list response", async () => {
    const data = await fetchNewsList();

    expect(data.results).toHaveLength(dummyData.list.results.length);
    expect(data.totalResults).toBe(dummyData.list.totalResults);
    expect(data.nextPage).toBe(dummyData.list.nextPage);
  });

  it("accepts page query without error", async () => {
    const data = await fetchNewsList({ query: { page: "page2token" } });

    expect(data.results).toBeDefined();
  });
});

describe("fetchNewsDetail", () => {
  it("fetches article by id", async () => {
    const data = await fetchNewsDetail({ pathParams: { id: "abc123" } });

    expect(data.article).toBeDefined();
    expect(data.article?.article_id).toBe(
      dummyData.list.results[0]?.article_id,
    );
  });
});
