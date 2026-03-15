export const useNewsApi = () => {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.newsApiBaseUrl,
    query: {
      apikey: config.newsApiKey,
    },
  })
}