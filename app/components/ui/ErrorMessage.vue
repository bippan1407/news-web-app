<template>
  <div class="error-box" role="alert">
    <p class="error-title">Something went wrong</p>
    <p class="error-body">{{ message ?? 'An unexpected error occurred. Please try again.' }}</p>
    <NuxtLink to="/" class="error-home-link">Go to homepage &rarr;</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<style scoped>
.error-box {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.error-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-error);
  margin-bottom: var(--spacing-sm);
}

.error-body {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.error-home-link {
  color: var(--color-primary);
  font-weight: 600;
}

.error-home-link:hover {
  text-decoration: underline;
}
</style>