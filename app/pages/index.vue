<template>
  <div>
    <UiPageTitle>Latest News</UiPageTitle>

    <div aria-live="polite" :aria-busy="pending">
      <p class="sr-only">
        {{ pending ? 'Loading articles, please wait.' : error ? 'Failed to load articles.' : !data?.results?.length ?
          'No articles found.' : `${data.results.length} articles loaded.` }}
      </p>

      <template v-if="pending">
        <UiGrid aria-label="Loading news articles">
          <UiLoadingSkeleton v-for="n in 10" :key="n" />
        </UiGrid>
      </template>

      <UiErrorMessage v-else-if="error" :message="error.message" />

      <UiEmptyState v-else-if="!data?.results?.length">
        No articles found.
      </UiEmptyState>

      <template v-else>
        <UiGrid aria-label="News articles">
          <NewsArticleCard v-for="(article, i) in data.results" :key="article.article_id" :article="article"
            :eager="i < 4" />
        </UiGrid>

        <UiPaginationControls :has-prev="hasPrev" :has-next="hasNext" label="News articles pagination" @prev="goPrev"
          @next="goNext" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchNewsList } from '~/api/news'
import { buildItemListSchema } from '~/utils/schema'

const { public: { siteUrl } } = useRuntimeConfig()

const { page, hasPrev, hasNext, goPrev, goNext } = useCursorPagination(() => data.value?.nextPage)

const { data, pending, error } = await useAsyncData(
  () => `news-list-${page.value ?? 'first'}`,
  () => fetchNewsList({ query: page.value ? { page: page.value } : {} }),
  { watch: [page] },
)

const firstArticleId = computed(() => data.value?.results?.[0]?.article_id)
useNewsPolling(firstArticleId)

useSeoMeta({
  title: `Latest News — ${SITE_NAME}`,
  description: 'Stay up to date with the latest news from around the world.',
  ogTitle: `Latest News — ${SITE_NAME}`,
  ogDescription: 'Stay up to date with the latest news from around the world.',
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: `${siteUrl}/og-image.svg`,
  twitterCard: 'summary_large_image',
  twitterTitle: `Latest News — ${SITE_NAME}`,
  twitterDescription: 'Stay up to date with the latest news from around the world.',
})

useHead(computed(() => ({
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [{ name: 'google-site-verification', content: 'ulTtoUB_NJ2JOGK0dMBnfMG02sURMP_wxBZgZCFO13A' }],
  script: data.value?.results?.length
    ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildItemListSchema(data.value.results, siteUrl)) }]
    : [],
})))
</script>
