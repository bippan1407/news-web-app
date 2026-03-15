import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import {
  UiErrorMessage,
  UiPageTitle,
  UiGrid,
  UiAppHeader,
  UiAppFooter,
  UiPaginationControls,
  UiLoadingSkeleton,
  UiEmptyState,
} from "#components";

// --------------- UiErrorMessage ---------------

describe("UiErrorMessage", () => {
  it("renders default error message", async () => {
    const component = await mountSuspended(UiErrorMessage);
    expect(component.text()).toContain("Something went wrong");
    expect(component.text()).toContain("An unexpected error occurred");
  });

  it("renders custom error message", async () => {
    const component = await mountSuspended(UiErrorMessage, {
      props: { message: "Custom error" },
    });
    expect(component.text()).toContain("Custom error");
  });

  it("has role=alert for accessibility", async () => {
    const component = await mountSuspended(UiErrorMessage);
    expect(component.find("[role='alert']").exists()).toBe(true);
  });

  it("contains a link to homepage", async () => {
    const component = await mountSuspended(UiErrorMessage);
    const link = component.find("a");
    expect(link.attributes("href")).toBe("/");
  });
});

// --------------- UiPageTitle ---------------

describe("UiPageTitle", () => {
  it("renders slot content inside h1", async () => {
    const component = await mountSuspended(UiPageTitle, {
      slots: { default: "Test Title" },
    });
    expect(component.find("h1").text()).toBe("Test Title");
  });
});

// --------------- UiGrid ---------------

describe("UiGrid", () => {
  it("renders slot content", async () => {
    const component = await mountSuspended(UiGrid, {
      slots: { default: "<div class='child'>Item</div>" },
    });
    expect(component.find(".child").exists()).toBe(true);
  });

  it("defaults to 2 columns", async () => {
    const component = await mountSuspended(UiGrid);
    expect(component.find(".grid").attributes("style")).toContain(
      "--grid-columns: 2",
    );
  });

  it("accepts custom column count", async () => {
    const component = await mountSuspended(UiGrid, {
      props: { columns: 3 },
    });
    expect(component.find(".grid").attributes("style")).toContain(
      "--grid-columns: 3",
    );
  });
});

// --------------- UiAppHeader ---------------

describe("UiAppHeader", () => {
  it("renders site logo with JustNews text", async () => {
    const component = await mountSuspended(UiAppHeader);
    expect(component.find(".logo-text").text()).toBe("JustNews");
  });

  it("logo links to homepage", async () => {
    const component = await mountSuspended(UiAppHeader);
    const logo = component.find(".site-logo");
    expect(logo.attributes("href")).toBe("/");
  });

  it("renders navigation with Latest link", async () => {
    const component = await mountSuspended(UiAppHeader);
    const nav = component.find("nav");
    expect(nav.attributes("aria-label")).toBe("Main navigation");
    expect(nav.text()).toContain("Latest");
  });

  it("does not show update dot when no new content", async () => {
    const component = await mountSuspended(UiAppHeader);
    expect(component.find(".update-dot").exists()).toBe(false);
  });

  it("shows update dot when new content is available", async () => {
    const hasNewContent = useState<boolean>("news-update-available");
    hasNewContent.value = true;

    const component = await mountSuspended(UiAppHeader);
    expect(component.find(".update-dot").exists()).toBe(true);

    hasNewContent.value = false;
  });

  it("shows sr-only text when new content is available", async () => {
    const hasNewContent = useState<boolean>("news-update-available");
    hasNewContent.value = true;

    const component = await mountSuspended(UiAppHeader);
    expect(component.find(".sr-only").text()).toContain(
      "new articles available",
    );

    hasNewContent.value = false;
  });

  it("resets hasNewContent and refreshes data on Latest click", async () => {
    const hasNewContent = useState<boolean>("news-update-available");
    hasNewContent.value = true;

    const component = await mountSuspended(UiAppHeader);
    await component.find(".nav-link").trigger("click");

    expect(hasNewContent.value).toBe(false);
  });

  it("does not reset hasNewContent on click when no new content", async () => {
    const hasNewContent = useState<boolean>("news-update-available");
    hasNewContent.value = false;

    const component = await mountSuspended(UiAppHeader);
    await component.find(".nav-link").trigger("click");

    expect(hasNewContent.value).toBe(false);
  });
});

// --------------- UiAppFooter ---------------

describe("UiAppFooter", () => {
  it("renders copyright with current year", async () => {
    const component = await mountSuspended(UiAppFooter);
    const year = new Date().getFullYear().toString();
    expect(component.text()).toContain(year);
  });

  it("renders JustNews brand name", async () => {
    const component = await mountSuspended(UiAppFooter);
    expect(component.text()).toContain("JustNews");
  });

  it("contains link to newsdata.io", async () => {
    const component = await mountSuspended(UiAppFooter);
    const link = component.find("a");
    expect(link.attributes("href")).toBe("https://newsdata.io");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");
  });
});

// --------------- UiPaginationControls ---------------

describe("UiPaginationControls", () => {
  it("renders both previous and next as disabled when neither available", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: false, hasNext: false },
    });
    const disabledBtns = component.findAll(".disabled");
    expect(disabledBtns).toHaveLength(2);
  });

  it("renders previous as button when hasPrev is true", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: true, hasNext: false },
    });
    const prevBtn = component.find("button");
    expect(prevBtn.text()).toContain("Previous");
  });

  it("renders next as button when hasNext is true", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: false, hasNext: true },
    });
    const buttons = component.findAll("button");
    const nextBtn = buttons.find((b) => b.text().includes("Next"));
    expect(nextBtn?.exists()).toBe(true);
  });

  it("renders both as buttons when both available", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: true, hasNext: true },
    });
    const buttons = component.findAll("button");
    expect(buttons).toHaveLength(2);
    expect(component.findAll(".disabled")).toHaveLength(0);
  });

  it("emits prev event when previous button is clicked", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: true, hasNext: false },
    });
    await component.find("button").trigger("click");
    expect(component.emitted("prev")).toHaveLength(1);
  });

  it("emits next event when next button is clicked", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: false, hasNext: true },
    });
    await component.find("button").trigger("click");
    expect(component.emitted("next")).toHaveLength(1);
  });

  it("has default aria-label of Pagination", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: false, hasNext: false },
    });
    expect(component.find("nav").attributes("aria-label")).toBe("Pagination");
  });

  it("accepts custom aria-label", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: {
        hasPrev: false,
        hasNext: false,
        label: "News pages",
      },
    });
    expect(component.find("nav").attributes("aria-label")).toBe("News pages");
  });

  it("disabled buttons have aria-disabled", async () => {
    const component = await mountSuspended(UiPaginationControls, {
      props: { hasPrev: false, hasNext: false },
    });
    const disabledBtns = component.findAll("[aria-disabled='true']");
    expect(disabledBtns).toHaveLength(2);
  });
});

// --------------- UiLoadingSkeleton ---------------

describe("UiLoadingSkeleton", () => {
  it("is hidden from screen readers", async () => {
    const component = await mountSuspended(UiLoadingSkeleton);
    expect(component.attributes("aria-hidden")).toBe("true");
  });

  it("renders card style by default (not bare)", async () => {
    const component = await mountSuspended(UiLoadingSkeleton);
    expect(component.find(".skeleton-card").exists()).toBe(true);
  });

  it("renders without card style when bare", async () => {
    const component = await mountSuspended(UiLoadingSkeleton, {
      props: { bare: true },
    });
    expect(component.find(".skeleton-card").exists()).toBe(false);
    expect(component.find(".skeleton-wrap").exists()).toBe(true);
  });

  it("defaults to 2 skeleton lines", async () => {
    const component = await mountSuspended(UiLoadingSkeleton);
    expect(component.findAll(".sk-title")).toHaveLength(2);
  });

  it("renders custom number of lines", async () => {
    const component = await mountSuspended(UiLoadingSkeleton, {
      props: { lines: 4 },
    });
    expect(component.findAll(".sk-title")).toHaveLength(4);
  });

  it("renders category and meta skeleton bars", async () => {
    const component = await mountSuspended(UiLoadingSkeleton);
    expect(component.find(".sk-category").exists()).toBe(true);
    expect(component.find(".sk-meta").exists()).toBe(true);
  });

  it("marks last title line with modifier class", async () => {
    const component = await mountSuspended(UiLoadingSkeleton, {
      props: { lines: 3 },
    });
    const titles = component.findAll(".sk-title");
    expect(titles[2]?.classes()).toContain("sk-title--last");
    expect(titles[0]?.classes()).not.toContain("sk-title--last");
  });

  it("renders slot content when provided", async () => {
    const component = await mountSuspended(UiLoadingSkeleton, {
      slots: { default: "<div class='custom'>Loading...</div>" },
    });
    expect(component.find(".custom").exists()).toBe(true);
    expect(component.find(".sk-title").exists()).toBe(false);
  });
});

// --------------- UiEmptyState ---------------

describe("UiEmptyState", () => {
  it("renders slot content", async () => {
    const component = await mountSuspended(UiEmptyState, {
      slots: { default: "No articles found" },
    });
    expect(component.text()).toBe("No articles found");
  });

  it("renders inside a p element", async () => {
    const component = await mountSuspended(UiEmptyState, {
      slots: { default: "Empty" },
    });
    expect(component.find("p.empty-state").exists()).toBe(true);
  });
});
