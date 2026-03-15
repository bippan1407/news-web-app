<template>
  <footer class="site-footer">
    <div class="container">
      <p class="footer-text">
        &copy; {{ year }} {{ SITE_NAME }} &mdash; Powered by
        <a href="https://newsdata.io" target="_blank" rel="noopener noreferrer">newsdata.io</a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--color-card-bg);
  border-top: 1px solid var(--color-border);
  padding-block: var(--spacing-lg);
  text-align: center;
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.footer-text a {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>