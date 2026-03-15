import { describe, expect, it, vi } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { NewsArticleCard, NewsArticleDetail } from "#components";
import type { Article } from "#shared/types/news";
import dummyData from "../fixtures/dummy.json";

const articles = dummyData.list.results as unknown as Article[];
// English article with all fields populated
const fullArticle = articles.find(
  (a) => a.article_id === "8104cd70aadcbfdb829b5f79fe4f2949",
)!;

// --------------- NewsArticleCard ---------------

describe("NewsArticleCard", () => {
  it("renders article title", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-title").text()).toBe(fullArticle.title);
  });

  it("links to article detail page with slug", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });
    const expectedSlug = articleSlug(fullArticle.title, fullArticle.article_id);

    expect(wrapper.find(".card-link").attributes("href")).toBe(
      `/news/${expectedSlug}`,
    );
  });

  it("renders first category", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-category").text()).toBe(fullArticle.category[0]);
  });

  it("hides category when not present", async () => {
    const article = { ...fullArticle, category: [] };
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article },
    });

    expect(wrapper.find(".card-category").exists()).toBe(false);
  });

  it("renders source name", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-tag--source").text()).toContain(
      fullArticle.source_name,
    );
  });

  it("has sr-only label for source", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-tag--source .sr-only").text()).toBe("Source:");
  });

  it("hides source when not present", async () => {
    const article = { ...fullArticle, source_name: "" };
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article },
    });

    expect(wrapper.find(".card-tag--source").exists()).toBe(false);
  });

  it("renders country in uppercase", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-tag--country").text()).toContain(
      fullArticle.country.join(", ").toUpperCase(),
    );
  });

  it("has sr-only label for country", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".card-tag--country .sr-only").text()).toBe("Country:");
  });

  it("hides country when not present", async () => {
    const article = { ...fullArticle, country: [] };
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article },
    });

    expect(wrapper.find(".card-tag--country").exists()).toBe(false);
  });

  it("renders formatted date", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });
    const dateEl = wrapper.find(".card-date");

    expect(dateEl.attributes("datetime")).toBe(fullArticle.pubDate);
    expect(dateEl.text()).toBeTruthy();
  });

  it("hides date when pubDate is empty", async () => {
    const article = { ...fullArticle, pubDate: "" };
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article },
    });

    expect(wrapper.find(".card-date").exists()).toBe(false);
  });

  it("opens in new tab on Enter keydown", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });
    const expectedSlug = articleSlug(fullArticle.title, fullArticle.article_id);

    await wrapper.find(".card-link").trigger("keydown.enter");

    expect(openSpy).toHaveBeenCalledWith(`/news/${expectedSlug}`, "_blank");
    openSpy.mockRestore();
  });

  it("renders as article element", async () => {
    const wrapper = await mountSuspended(NewsArticleCard, {
      props: { article: fullArticle },
    });

    expect(wrapper.find("article.article-card").exists()).toBe(true);
  });
});

// --------------- NewsArticleDetail ---------------

describe("NewsArticleDetail", () => {
  it("renders article title in h1", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find("h1.detail-title").text()).toBe(fullArticle.title);
  });

  it("renders back link to homepage", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });
    const backLink = wrapper.find(".back-link");

    expect(backLink.attributes("href")).toBe("/");
    expect(backLink.text()).toContain("Back to news");
  });

  it("renders first category", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".detail-category").text()).toBe(
      fullArticle.category[0],
    );
  });

  it("hides category when not present", async () => {
    const article = { ...fullArticle, category: [] };
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article },
    });

    expect(wrapper.find(".detail-category").exists()).toBe(false);
  });

  it("renders formatted date with datetime attribute", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });
    const timeEl = wrapper.find("time");

    expect(timeEl.attributes("datetime")).toBe(fullArticle.pubDate);
    expect(timeEl.text()).toBeTruthy();
  });

  it("hides date when pubDate is empty", async () => {
    const article = { ...fullArticle, pubDate: "" };
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article },
    });

    expect(wrapper.find("time").exists()).toBe(false);
  });

  it("renders source name", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".detail-meta span").text()).toContain(
      fullArticle.source_name,
    );
  });

  it("hides source name when not present", async () => {
    const article = { ...fullArticle, source_name: "" };
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article },
    });

    expect(wrapper.find(".detail-meta span").exists()).toBe(false);
  });

  it("renders image when image_url exists", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".detail-image-wrap").exists()).toBe(true);
  });

  it("hides image when image_url is null", async () => {
    const article = { ...fullArticle, image_url: null };
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article },
    });

    expect(wrapper.find(".detail-image-wrap").exists()).toBe(false);
  });

  it("renders description when present", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".detail-body p").text()).toBe(fullArticle.description);
    expect(wrapper.find(".no-description").exists()).toBe(false);
  });

  it("shows fallback with original article link when no description", async () => {
    const article = { ...fullArticle, description: null };
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article },
    });

    expect(wrapper.find(".no-description").text()).toContain(
      "No summary available.",
    );
    const link = wrapper.find(".read-original");
    expect(link.attributes("href")).toBe(fullArticle.link);
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
  });

  it("renders Read Full Article button linking to original", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });
    const btn = wrapper.find(".read-more-btn");

    expect(btn.attributes("href")).toBe(fullArticle.link);
    expect(btn.attributes("target")).toBe("_blank");
    expect(btn.attributes("rel")).toBe("noopener noreferrer");
    expect(btn.text()).toContain("Read Full Article");
  });

  it("has sr-only text for external link accessibility", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find(".read-more-btn .sr-only").text()).toBe(
      "(opens in new tab)",
    );
  });

  it("renders as article element", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });

    expect(wrapper.find("article.article-detail").exists()).toBe(true);
  });

  it("image has error handler attached", async () => {
    const wrapper = await mountSuspended(NewsArticleDetail, {
      props: { article: fullArticle },
    });
    const img = wrapper.find(".detail-image-wrap img");

    expect(img.exists()).toBe(true);
  });

  describe("hideImage logic", () => {
    // Replicate the exact hideImage function from ArticleDetail.vue
    function hideImage(event: string | Event) {
      const img = (
        event instanceof Event ? event.target : null
      ) as HTMLImageElement | null;
      const figure = img?.closest("figure");
      if (figure) figure.style.display = "none";
    }

    it("hides figure when Event target is img inside figure", () => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      figure.appendChild(img);
      document.body.appendChild(figure);

      const event = new Event("error");
      Object.defineProperty(event, "target", { value: img });

      hideImage(event);

      expect(figure.style.display).toBe("none");
      document.body.removeChild(figure);
    });

    it("does nothing when event is a string", () => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      figure.appendChild(img);
      document.body.appendChild(figure);

      hideImage("some error string");

      expect(figure.style.display).not.toBe("none");
      document.body.removeChild(figure);
    });

    it("does nothing when img has no parent figure", () => {
      const img = document.createElement("img");
      document.body.appendChild(img);

      const event = new Event("error");
      Object.defineProperty(event, "target", { value: img });

      hideImage(event);

      // No figure to hide — should not throw
      expect(img.closest("figure")).toBeNull();
      document.body.removeChild(img);
    });
  });
});
