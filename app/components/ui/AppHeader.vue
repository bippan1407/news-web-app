<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="site-logo">
        <span class="logo-text">{{ SITE_NAME }}</span>
      </NuxtLink>
      <nav aria-label="Main navigation">
        <NuxtLink to="/" class="nav-link" @click="handleLatestClick">
          Latest
          <span v-if="hasNewContent" class="update-dot" />
          <span v-if="hasNewContent" class="sr-only">— new articles available, click to refresh</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const hasNewContent = useState<boolean>('news-update-available', () => false)

function handleLatestClick() {
  if (hasNewContent.value) {
    hasNewContent.value = false
    refreshNuxtData()
  }
}
</script>

<style scoped>
.site-header {
  background: var(--color-card-bg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.site-logo {
  font-weight: 800;
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
}

.update-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--color-error);
  border-radius: 50%;
  margin-left: var(--spacing-xs);
  vertical-align: middle;
  animation: pulse 2s ease-in-out infinite;
}
</style>