import { describe, expect, it } from "vitest";
import {
  mountSuspended,
  mockNuxtImport,
  registerEndpoint,
} from "@nuxt/test-utils/runtime";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const detailKey = "8104cd70aadcbfdb829b5f79fe4f2949" as keyof typeof dummyData;
const detailArticle = (dummyData[detailKey] as { results: Article[] })
  .results[0] as Article;

const mockRoute = {
  params: { slug: `salman-agha-run-out-${detailArticle.article_id}` },
  path: `/news/salman-agha-run-out-${detailArticle.article_id}`,
  query: {},
};

mockNuxtImport("useRoute", () => () => mockRoute);

registerEndpoint(`/api/news/${detailArticle.article_id}`, () => ({
  article: detailArticle,
}));

registerEndpoint("/api/news/missingid", () => ({ article: null }));

describe("Detail page", () => {
  it("renders article detail", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    expect(wrapper.find(".article-detail").exists()).toBe(true);
  });

  it("renders article title in h1", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    expect(wrapper.find("h1.detail-title").text()).toBe(detailArticle.title);
  });

  it("renders back link to homepage", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    const backLink = wrapper.find(".back-link");
    expect(backLink.attributes("href")).toBe("/");
  });

  it("renders article description", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    expect(wrapper.find(".detail-body p").text()).toBe(
      detailArticle.description,
    );
  });

  it("renders Read Full Article link", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    const btn = wrapper.find(".read-more-btn");
    expect(btn.attributes("href")).toBe(detailArticle.link);
  });

  it("shows not found message for missing article", async () => {
    mockRoute.params.slug = "missing-article-missingid";
    mockRoute.path = "/news/missing-article-missingid";

    const wrapper = await mountSuspended(
      await import("../../app/pages/news/[slug].vue").then((m) => m.default),
    );

    expect(wrapper.text()).toContain("This article could not be found");

    // Restore
    mockRoute.params.slug = `salman-agha-run-out-${detailArticle.article_id}`;
    mockRoute.path = `/news/salman-agha-run-out-${detailArticle.article_id}`;
  });
});
