import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import { ref, nextTick } from "vue";

let endpointArticleId = "new-article-id";

registerEndpoint("/api/news", () => ({
  results: [{ article_id: endpointArticleId }],
  nextPage: null,
  totalResults: 1,
}));

let capturedIntervalCallback: (() => void) | null = null;
let setIntervalSpy: ReturnType<typeof vi.spyOn>;
let clearIntervalSpy: ReturnType<typeof vi.spyOn>;

function buildComponent(initialId?: string) {
  const currentId = ref<string | undefined>(initialId);
  return {
    currentId,
    component: defineComponent({
      template: "<div>{{ hasNewContent }}</div>",
      setup() {
        const { hasNewContent } = useNewsPolling(currentId);
        return { hasNewContent };
      },
    }),
  };
}

describe("useNewsPolling", () => {
  beforeEach(() => {
    endpointArticleId = "new-article-id";
    capturedIntervalCallback = null;

    // Reset shared state
    useState<boolean>("news-update-available").value = false;

    // Capture the interval callback instead of using fake timers
    setIntervalSpy = vi.spyOn(globalThis, "setInterval").mockImplementation(((
      fn: () => void,
    ) => {
      capturedIntervalCallback = fn;
      return 999 as unknown as ReturnType<typeof setInterval>;
    }) as typeof setInterval);
    clearIntervalSpy = vi
      .spyOn(globalThis, "clearInterval")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  // --- initial state ---

  it("returns hasNewContent as false initially", async () => {
    const { component } = buildComponent("old-article-id");
    const wrapper = await mountSuspended(component);

    expect(wrapper.text()).toBe("false");
  });

  // --- onMounted ---

  it("starts polling on mount", async () => {
    const { component } = buildComponent("old-id");
    await mountSuspended(component);

    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      60 * 60 * 1000,
    );
  });

  it("adds visibilitychange listener on mount", async () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const { component } = buildComponent("old-id");
    await mountSuspended(component);

    expect(addSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    addSpy.mockRestore();
  });

  // --- seedFromCurrent ---

  it("seeds from currentFirstArticleId on mount", async () => {
    endpointArticleId = "different-id";
    const { component } = buildComponent("seeded-id");
    const wrapper = await mountSuspended(component);

    // Trigger the captured interval callback
    await capturedIntervalCallback!();
    await nextTick();

    // lastKnownArticleId was "seeded-id", endpoint returns "different-id"
    expect(wrapper.text()).toBe("true");
  });

  it("does not seed when currentFirstArticleId is undefined", async () => {
    endpointArticleId = "any-id";
    const { component } = buildComponent(undefined);
    const wrapper = await mountSuspended(component);

    // lastKnownArticleId stays undefined → no detection
    await capturedIntervalCallback!();
    await nextTick();

    expect(wrapper.text()).toBe("false");
  });

  // --- checkForNewContent ---

  it("detects new content when article id differs", async () => {
    endpointArticleId = "different-id";
    const { component } = buildComponent("old-id");
    const wrapper = await mountSuspended(component);

    await capturedIntervalCallback!();
    await nextTick();

    expect(wrapper.text()).toBe("true");
  });

  it("does not flag when article id is the same", async () => {
    endpointArticleId = "same-id";
    const { component } = buildComponent("same-id");
    const wrapper = await mountSuspended(component);

    await capturedIntervalCallback!();
    await nextTick();

    expect(wrapper.text()).toBe("false");
  });

  it("does not flag when endpoint returns empty results", async () => {
    registerEndpoint("/api/news", () => ({
      results: [],
      nextPage: null,
      totalResults: 0,
    }));

    const { component } = buildComponent("old-id");
    const wrapper = await mountSuspended(component);

    await capturedIntervalCallback!();
    await nextTick();

    expect(wrapper.text()).toBe("false");

    // Re-register default endpoint
    registerEndpoint("/api/news", () => ({
      results: [{ article_id: endpointArticleId }],
      nextPage: null,
      totalResults: 1,
    }));
  });

  // --- startPolling idempotency ---

  it("does not create duplicate intervals", async () => {
    const { component } = buildComponent("old-id");
    await mountSuspended(component);

    // onMounted calls startPolling once
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });

  // --- watch(currentFirstArticleId) ---

  it("re-seeds when currentFirstArticleId ref changes", async () => {
    endpointArticleId = "third-id";
    const { currentId, component } = buildComponent("first-id");
    const wrapper = await mountSuspended(component);

    // Change the ref → watcher re-seeds lastKnownArticleId to "second-id"
    currentId.value = "second-id";
    await nextTick();

    // Endpoint returns "third-id" which differs from "second-id"
    await capturedIntervalCallback!();
    await nextTick();

    expect(wrapper.text()).toBe("true");
  });

  it("skips re-seed when ref changes to undefined", async () => {
    endpointArticleId = "new-id";
    const { currentId, component } = buildComponent("initial-id");
    const wrapper = await mountSuspended(component);

    // Set to undefined → seedFromCurrent skips, lastKnownArticleId stays "initial-id"
    currentId.value = undefined;
    await nextTick();

    await capturedIntervalCallback!();
    await nextTick();

    // "new-id" !== "initial-id" → detected
    expect(wrapper.text()).toBe("true");
  });

  // --- onVisibilityChange ---

  it("stops polling when tab becomes hidden", async () => {
    const { component } = buildComponent("old-id");
    await mountSuspended(component);

    Object.defineProperty(document, "hidden", { value: true, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(clearIntervalSpy).toHaveBeenCalled();

    Object.defineProperty(document, "hidden", { value: false, writable: true });
  });

  it("restarts interval when tab becomes visible again", async () => {
    const { component } = buildComponent("old-id");
    await mountSuspended(component);

    // Hide → clears interval
    Object.defineProperty(document, "hidden", { value: true, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(clearIntervalSpy).toHaveBeenCalled();

    // Reset spies
    setIntervalSpy.mockClear();
    clearIntervalSpy.mockClear();

    // Show → restarts interval
    Object.defineProperty(document, "hidden", { value: false, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(setIntervalSpy).toHaveBeenCalledWith(
      expect.any(Function),
      60 * 60 * 1000,
    );
  });

  // --- onBeforeUnmount ---

  it("clears interval on unmount", async () => {
    const { component } = buildComponent("old-id");
    const wrapper = await mountSuspended(component);

    wrapper.unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it("removes visibilitychange listener on unmount", async () => {
    const removeSpy = vi.spyOn(document, "removeEventListener");
    const { component } = buildComponent("old-id");
    const wrapper = await mountSuspended(component);

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "visibilitychange",
      expect.any(Function),
    );
    removeSpy.mockRestore();
  });

  it("resets hasNewContent to false on unmount", async () => {
    endpointArticleId = "different-id";
    const { component } = buildComponent("old-id");
    const wrapper = await mountSuspended(component);

    // Trigger new content
    await capturedIntervalCallback!();
    await nextTick();
    expect(wrapper.text()).toBe("true");

    // Unmount resets
    wrapper.unmount();

    const hasNew = useState<boolean>("news-update-available");
    expect(hasNew.value).toBe(false);
  });
});
