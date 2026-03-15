<template>
  <div class="skeleton-wrap" :class="{ 'skeleton-card': !bare }" aria-hidden="true">
    <slot>
      <div class="sk-bar sk-category" />
      <div v-for="n in lines" :key="n" class="sk-bar sk-title" :class="{ 'sk-title--last': n === lines }" />
      <div class="sk-bar sk-meta" />
    </slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  bare?: boolean
  lines?: number
}>(), {
  lines: 2,
})
</script>

<style scoped>
.skeleton-wrap {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.sk-category {
  height: 12px;
  width: 25%;
  margin-bottom: var(--spacing-md);
}

.sk-title {
  height: 18px;
  width: 95%;
}

.sk-title--last {
  width: 60%;
}

.sk-meta {
  height: 12px;
  width: 45%;
  margin-top: var(--spacing-md);
}
</style>