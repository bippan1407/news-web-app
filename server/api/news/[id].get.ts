import type {
  NewsDetailApiResponse,
  NewsListApiResponse,
} from "#shared/types/news";
import { HttpStatus, ApiResponse } from "#shared/types/http";

export default defineEventHandler(async (event) => {
  const newsApi = useNewsApi();
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: HttpStatus.BAD_REQUEST,
      message: "Article ID is required",
    });
  }

  let data: ApiResponse<NewsListApiResponse>;
  try {
    data = await newsApi<ApiResponse<NewsListApiResponse>>("/latest", {
      query: { id },
    });
  } catch {
    throw createError({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: "Failed to fetch article from upstream",
    });
  }

  if (data.status !== "success") {
    throw createError({
      statusCode: HttpStatus.BAD_GATEWAY,
      message: data.results.message,
    });
  }

  return {
    article: data.results?.[0] ?? null,
  } satisfies NewsDetailApiResponse;
});
