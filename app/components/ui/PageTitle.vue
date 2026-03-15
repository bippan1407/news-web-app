<template>
  <h1 class="page-title">
    <slot />
  </h1>
</template>

<style scoped>
.page-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
}
</style>
