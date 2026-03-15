<template>
  <div class="grid" :style="{ '--grid-columns': columns }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  columns?: number
}>(), {
  columns: 2,
})
</script>

<style scoped>
.grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(var(--grid-columns), 1fr);
  }
}
</style>
