import type { NewsListApiResponse } from "#shared/types/news";

const POLL_INTERVAL = 60 * 60 * 1000; // 10 minutes

export function useNewsPolling(currentFirstArticleId: Ref<string | undefined>) {
  const hasNewContent = useState<boolean>("news-update-available", () => false);

  if (!import.meta.client) return { hasNewContent };

  let lastKnownArticleId: string | undefined;
  let timerId: ReturnType<typeof setInterval> | null = null;

  function seedFromCurrent() {
    if (currentFirstArticleId.value) {
      lastKnownArticleId = currentFirstArticleId.value;
    }
  }

  async function checkForNewContent() {
    try {
      const response = await $fetch<NewsListApiResponse>("/api/news");
      const latestId = response.results?.[0]?.article_id;
      if (latestId && lastKnownArticleId && latestId !== lastKnownArticleId) {
        hasNewContent.value = true;
      }
    } catch {
      // Silently ignore polling errors
    }
  }

  function startPolling() {
    if (timerId) return;
    timerId = setInterval(checkForNewContent, POLL_INTERVAL);
  }

  function stopPolling() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function onVisibilityChange() {
    if (document.hidden) {
      stopPolling();
    } else {
      startPolling();
      checkForNewContent();
    }
  }

  watch(currentFirstArticleId, () => {
    seedFromCurrent();
  });

  onMounted(() => {
    seedFromCurrent();
    startPolling();
    document.addEventListener("visibilitychange", onVisibilityChange);
  });

  onBeforeUnmount(() => {
    stopPolling();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    hasNewContent.value = false;
  });

  return { hasNewContent };
}
