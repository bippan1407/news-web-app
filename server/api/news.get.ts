import type { NewsListApiResponse } from "#shared/types/news";
import { HttpStatus, ApiResponse } from "#shared/types/http";

export default defineEventHandler(async (event) => {
  const newsApi = useNewsApi();
  const query = getQuery(event);
  const cursor = query.page as string | undefined;

  let data: ApiResponse<NewsListApiResponse>;
  try {
    data = await newsApi<ApiResponse<NewsListApiResponse>>("/latest", {
      query: { size: "10", ...(cursor && { page: cursor }) },
    });
  } catch {
    throw createError({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: "Failed to fetch news from upstream",
    });
  }

  if (data.status !== "success") {
    throw createError({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: data.results.message,
    });
  }
  return {
    results: data.results,
    nextPage: data.nextPage ?? null,
    totalResults: data.totalResults,
  } satisfies NewsListApiResponse;
});
