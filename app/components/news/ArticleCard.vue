<template>
  <article class="article-card">
    <NuxtLink :to="`/news/${articleSlug(article.title, article.article_id)}`" class="card-link"
      @keydown.enter.prevent="openInNewTab">
      <div class="card-body">
        <p v-if="article.category?.[0]" class="card-category">
          {{ article.category[0] }}
        </p>
        <h2 class="card-title">{{ article.title }}</h2>
        <div class="card-meta">
          <p v-if="article.source_name" class="card-tag card-tag--source">
            <span class="sr-only">Source: </span>{{ article.source_name }}
          </p>
          <p v-if="article.country?.length" class="card-tag card-tag--country">
            <span class="sr-only">Country: </span>{{ article.country.join(', ').toUpperCase() }}
          </p>
          <time v-if="article.pubDate" class="card-date" :datetime="article.pubDate">
            {{ formatDate(article.pubDate) }}
          </time>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { Article } from '#shared/types/news'

const props = defineProps<{
  article: Article
  eager?: boolean
}>()

function openInNewTab() {
  const path = `/news/${articleSlug(props.article.title, props.article.article_id)}`
  window.open(path, '_blank')
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.article-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.article-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.article-card:focus-within {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-md);
  overflow: visible;
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-link:focus-visible {
  outline: none;
}

.card-link {
  display: block;
}

.card-image {
  margin: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-category {
  display: inline-block;
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs, 4px);
  align-items: center;
  margin: 0;
  margin-top: var(--spacing-sm);
}

.card-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-tag--source {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
  font-style: normal;
}

.card-tag--country {
  background: color-mix(in srgb, var(--color-text-muted) 12%, transparent);
  color: var(--color-text-muted);
}

.card-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
</style>