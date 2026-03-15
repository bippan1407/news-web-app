import { describe, expect, it, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ref } from "vue";

const mockRoute = ref({
  path: "/",
  query: {} as Record<string, string>,
});

const mockHistory = ref<string[]>([]);

mockNuxtImport("useRoute", () => () => mockRoute.value);

mockNuxtImport("useState", () => (_key: string, init: () => string[]) => {
  if (mockHistory.value.length === 0 && init) mockHistory.value = init();
  return mockHistory;
});

mockNuxtImport(
  "navigateTo",
  () => (to: { path: string; query?: Record<string, string> }) => {
    mockRoute.value = { path: to.path, query: to.query || {} };
  },
);

beforeEach(() => {
  mockRoute.value = { path: "/", query: {} };
  mockHistory.value = [];
});

describe("useCursorPagination", () => {
  describe("page", () => {
    it("returns page from query string", () => {
      mockRoute.value = { path: "/", query: { page: "page2token" } };
      const { page } = useCursorPagination(ref(null));

      expect(page.value).toBe("page2token");
    });

    it("returns undefined when page is missing", () => {
      const { page } = useCursorPagination(ref(null));

      expect(page.value).toBeUndefined();
    });
  });

  describe("hasPrev", () => {
    it("returns false when history is empty", () => {
      const { hasPrev } = useCursorPagination(ref(null));

      expect(hasPrev.value).toBe(false);
    });

    it("returns true when history has entries", () => {
      mockHistory.value = [""];
      const { hasPrev } = useCursorPagination(ref(null));

      expect(hasPrev.value).toBe(true);
    });
  });

  describe("hasNext", () => {
    it("returns false when nextPage is null", () => {
      const { hasNext } = useCursorPagination(ref(null));

      expect(hasNext.value).toBe(false);
    });

    it("returns false when nextPage is empty string", () => {
      const { hasNext } = useCursorPagination(ref(""));

      expect(hasNext.value).toBe(false);
    });

    it("returns true when nextPage has a value", () => {
      const { hasNext } = useCursorPagination(ref("nexttoken"));

      expect(hasNext.value).toBe(true);
    });
  });

  describe("goNext", () => {
    it("navigates to next page and pushes empty string for first page", () => {
      const { goNext } = useCursorPagination(ref("C2"));
      goNext();

      expect(mockRoute.value.query).toEqual({ page: "C2" });
      expect(mockHistory.value).toEqual([""]);
    });

    it("pushes current page onto history", () => {
      mockRoute.value = { path: "/", query: { page: "C2" } };
      mockHistory.value = [""];
      const { goNext } = useCursorPagination(ref("C3"));
      goNext();

      expect(mockRoute.value.query).toEqual({ page: "C3" });
      expect(mockHistory.value).toEqual(["", "C2"]);
    });

    it("does nothing when nextPage is null", () => {
      const { goNext } = useCursorPagination(ref(null));
      goNext();

      expect(mockRoute.value.query).toEqual({});
      expect(mockHistory.value).toEqual([]);
    });
  });

  describe("goPrev", () => {
    it("does nothing when history is empty", () => {
      mockRoute.value = { path: "/", query: { page: "C2" } };
      const { goPrev } = useCursorPagination(ref(null));
      goPrev();

      expect(mockRoute.value.query).toEqual({ page: "C2" });
    });

    it("navigates to first page when previous page is empty string", () => {
      mockRoute.value = { path: "/", query: { page: "C2" } };
      mockHistory.value = [""];
      const { goPrev } = useCursorPagination(ref(null));
      goPrev();

      expect(mockRoute.value.query).toEqual({});
      expect(mockHistory.value).toEqual([]);
    });

    it("navigates to previous page and pops history", () => {
      mockRoute.value = { path: "/", query: { page: "C3" } };
      mockHistory.value = ["", "C2"];
      const { goPrev } = useCursorPagination(ref(null));
      goPrev();

      expect(mockRoute.value.query).toEqual({ page: "C2" });
      expect(mockHistory.value).toEqual([""]);
    });
  });

  describe("full navigation flow", () => {
    it("supports navigating forward 3 pages and back to page 1", () => {
      const nextPage = ref<string | null>("C2");

      // Page 1: go to page 2
      useCursorPagination(nextPage).goNext();
      expect(mockRoute.value.query).toEqual({ page: "C2" });
      expect(mockHistory.value).toEqual([""]);

      // Page 2: go to page 3
      nextPage.value = "C3";
      useCursorPagination(nextPage).goNext();
      expect(mockRoute.value.query).toEqual({ page: "C3" });
      expect(mockHistory.value).toEqual(["", "C2"]);

      // Page 3: go back to page 2
      useCursorPagination(nextPage).goPrev();
      expect(mockRoute.value.query).toEqual({ page: "C2" });
      expect(mockHistory.value).toEqual([""]);

      // Page 2: go back to page 1
      useCursorPagination(nextPage).goPrev();
      expect(mockRoute.value.query).toEqual({});
      expect(mockHistory.value).toEqual([]);
    });
  });
});
