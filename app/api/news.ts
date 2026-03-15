import type {
  NewsDetailApiResponse,
  NewsListApiResponse,
} from "#shared/types/news";
import type { IGetParams } from "#shared/types/http";

type NewsListQuery = { page?: string };
type NewsDetailPathParams = { id: string };

export const fetchNewsList = ({
  query,
}: IGetParams<Record<string, never>, NewsListQuery> = {}) => {
  const { $api } = useNuxtApp();
  return $api<NewsListApiResponse>("/news", { query });
};

export const fetchNewsDetail = ({
  pathParams,
}: IGetParams<NewsDetailPathParams>) => {
  const { $api } = useNuxtApp();
  return $api<NewsDetailApiResponse>(`/news/${pathParams!.id}`);
};
