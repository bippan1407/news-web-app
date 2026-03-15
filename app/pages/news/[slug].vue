<template>
  <div>
    <UiLoadingSkeleton v-if="pending" :bare="false" :lines="10" />
    <UiErrorMessage v-else-if="error" :message="error.message" />
    <UiErrorMessage v-else-if="!data?.article" message="This article could not be found." />
    <NewsArticleDetail v-else :article="data.article" />
  </div>
</template>

<script setup lang="ts">
import { fetchNewsDetail } from '~/api/news'
import { buildArticleSchema } from '~/utils/schema'

const route = useRoute()
const { public: { siteUrl } } = useRuntimeConfig()
const slug = computed(() => route.params.slug as string)
const id = computed(() => articleIdFromSlug(slug.value))

const { data, pending, error } = await useAsyncData(
  () => `news-detail-${id.value}`,
  () => fetchNewsDetail({ pathParams: { id: id.value } }),
)

useSeoMeta({
  title: () =>
    data.value?.article ? `${data.value.article.title} — ${SITE_NAME}` : `Article — ${SITE_NAME}`,
  description: () =>
    data.value?.article?.description ?? `Read the latest news on ${SITE_NAME}.`,
  ogTitle: () => data.value?.article?.title ?? SITE_NAME,
  ogDescription: () => data.value?.article?.description ?? '',
  ogImage: () => data.value?.article?.image_url ?? '',
  ogType: 'article',
})

useHead(computed(() => {
  const article = data.value?.article
  if (!article) return {}

  return {
    link: [{ rel: 'canonical', href: article.link }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(buildArticleSchema(article, siteUrl)) }],
  }
}))
</script>