<template>
  <div class="site-wrapper">
    <UiAppHeader />
    <main class="main-content">
      <div class="container">
        <slot />
      </div>
    </main>
    <UiAppFooter />
  </div>
</template>

<style scoped>
.site-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-block: var(--spacing-xl);
}
</style>