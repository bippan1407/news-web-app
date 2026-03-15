import { describe, expect, it } from "vitest";
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const articles = dummyData.list.results as unknown as Article[];

registerEndpoint("/api/news", () => ({
  results: articles,
  nextPage: dummyData.list.nextPage,
  totalResults: dummyData.list.totalResults,
}));

describe("Index page", () => {
  it("renders page title", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    expect(wrapper.find("h1").text()).toBe("Latest News");
  });

  it("renders article cards", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    const cards = wrapper.findAll(".article-card");
    expect(cards.length).toBe(articles.length);
  });

  it("renders first article title", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    const firstTitle = wrapper.find(".card-title");
    expect(firstTitle.text()).toBe(articles[0]?.title);
  });

  it("has aria-live region for loading state", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    const liveRegion = wrapper.find("[aria-live='polite']");
    expect(liveRegion.exists()).toBe(true);
  });

  it("shows articles loaded count in sr-only text", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    const srOnly = wrapper.find(".sr-only");
    expect(srOnly.text()).toContain("articles loaded");
  });

  it("renders pagination controls", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    expect(wrapper.find(".pagination").exists()).toBe(true);
  });

  it("renders grid with articles aria-label", async () => {
    const wrapper = await mountSuspended(
      await import("../../app/pages/index.vue").then((m) => m.default),
    );

    const grid = wrapper.find("[aria-label='News articles']");
    expect(grid.exists()).toBe(true);
  });
});
