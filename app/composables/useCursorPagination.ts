export function useCursorPagination(
  nextPage: MaybeRefOrGetter<string | null | undefined>,
) {
  const route = useRoute();

  const page = computed(() =>
    typeof route.query.page === "string" ? route.query.page : undefined,
  );

  // Persists across client-side navigations (e.g. article detail → back to list)
  const history = useState<string[]>("pagination-history", () => []);

  const hasPrev = computed(() => history.value.length > 0);
  const hasNext = computed(() => !!toValue(nextPage));

  function goNext() {
    const token = toValue(nextPage);
    if (!token) return;
    history.value = [...history.value, page.value ?? ""];
    navigateTo({ path: route.path, query: { page: token } });
  }

  function goPrev() {
    if (history.value.length === 0) return;
    const stack = [...history.value];
    const prevPage = stack.pop()!;
    history.value = stack;

    if (prevPage === "") {
      navigateTo({ path: route.path });
    } else {
      navigateTo({ path: route.path, query: { page: prevPage } });
    }
  }

  return { page, hasPrev, hasNext, goPrev, goNext };
}
