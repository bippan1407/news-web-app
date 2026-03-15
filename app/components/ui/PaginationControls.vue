<template>
  <nav class="pagination" :aria-label="label">
    <button v-if="hasPrev" class="pagination-btn" @click="$emit('prev')">
      &larr; Previous
    </button>
    <span v-else class="pagination-btn disabled" aria-disabled="true">
      &larr; Previous
    </span>

    <button v-if="hasNext" class="pagination-btn" @click="$emit('next')">
      Next &rarr;
    </button>
    <span v-else class="pagination-btn disabled" aria-disabled="true">
      Next &rarr;
    </span>
  </nav>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  hasPrev: boolean
  hasNext: boolean
  label?: string
}>(), {
  label: 'Pagination',
})

defineEmits<{
  prev: []
  next: []
}>()
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-2xl);
}

.pagination-btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--font-size-sm);
  background: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.pagination-btn:not(.disabled):hover {
  background: var(--color-primary);
  color: #fff;
}

.pagination-btn.disabled {
  border-color: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: var(--radius-md);
}
</style>