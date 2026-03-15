<template>
  <p class="empty-state">
    <slot />
  </p>
</template>

<style scoped>
.empty-state {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-2xl);
  font-size: var(--font-size-lg);
}
</style>
