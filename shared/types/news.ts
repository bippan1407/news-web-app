export interface Article {
  article_id: string;
  title: string;
  description: string | null;
  content: string;
  link: string;
  keywords: string[] | null;
  creator: string[] | null;
  language: string;
  country: string[];
  category: string[];
  datatype: string;
  pubDate: string;
  pubDateTZ: string;
  fetched_at: string;
  image_url: string | null;
  video_url: string | null;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  duplicate: boolean;
}
export interface NewsListApiResponse {
  results: Article[];
  nextPage: string | null;
  totalResults: number;
}

export interface NewsDetailApiResponse {
  article: Article | null;
}
