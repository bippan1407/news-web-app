<template>
  <article class="article-detail">
    <NuxtLink to="/" class="back-link">&larr; Back to news</NuxtLink>

    <header class="detail-header">
      <div v-if="article.category?.[0]" class="detail-category">
        {{ article.category[0] }}
      </div>
      <h1 class="detail-title">{{ article.title }}</h1>
      <div class="detail-meta">
        <time v-if="article.pubDate" :datetime="article.pubDate">
          {{ formatDate(article.pubDate) }}
        </time>
        <span v-if="article.source_name">{{ article.source_name }}</span>
      </div>
    </header>

    <figure v-if="article.image_url" class="detail-image-wrap">
      <NuxtImg :src="article.image_url" :alt="article.title" class="detail-image" width="960" height="540"
        loading="eager" preload fetchpriority="high" placeholder placeholder-class="detail-image-placeholder"
        @error="hideImage" />
    </figure>

    <div class="detail-body">
      <p v-if="article.description">{{ article.description }}</p>
      <p v-else class="no-description">
        No summary available.
        <a :href="article.link" target="_blank" rel="noopener noreferrer" class="read-original">
          Read the original article <span aria-hidden="true">&rarr;</span>
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </p>
    </div>

    <p class="detail-footer">
      <a :href="article.link" target="_blank" rel="noopener noreferrer" class="read-more-btn">
        Read Full Article <span aria-hidden="true">&rarr;</span>
        <span class="sr-only">(opens in new tab)</span>
      </a>
    </p>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '#shared/types/news'

defineProps<{
  article: Article
}>()

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function hideImage(event: string | Event) {
  const img = (event instanceof Event ? event.target : null) as HTMLImageElement | null
  const figure = img?.closest('figure')
  if (figure) figure.style.display = 'none'
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-bottom: var(--spacing-xl);
  text-decoration: underline;
}

.detail-header {
  margin-bottom: var(--spacing-xl);
}

.detail-category {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: var(--spacing-sm);
}

.detail-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: var(--spacing-sm);
}

.detail-meta {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.detail-meta span::before {
  content: '·';
  margin-right: var(--spacing-sm);
}

.detail-image-wrap {
  margin-bottom: var(--spacing-xl);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.detail-image {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
}

:global(.detail-image-placeholder) {
  width: 100%;
  max-height: 480px;
  object-fit: cover;
  filter: blur(8px);
  transform: scale(1.05);
}

.detail-body {
  font-size: var(--font-size-lg);
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
}

.no-description {
  color: var(--color-text-muted);
  font-style: italic;
}

.read-original {
  color: var(--color-primary);
  text-decoration: underline;
}

.detail-footer {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: background 0.2s;
}

.read-more-btn:hover {
  background: var(--color-primary-hover);
}

.read-more-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-md);
}

@media (max-width: 640px) {
  .detail-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
