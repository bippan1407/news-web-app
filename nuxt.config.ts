// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: { url: process.env.SITE_URL },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    newsApiKey: process.env.NEWS_API_KEY,
    newsApiBaseUrl: process.env.NEWS_API_BASE_URL,
    public: {
      siteUrl: process.env.SITE_URL,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
    },
  },
  ssr: true,
  modules: ["@nuxt/image", "@nuxtjs/sitemap", "@nuxt/test-utils/module"],
  sitemap: {
    sources: ["/api/_sitemap/news-urls"],
    urls: [
      {
        loc: "/",
        changefreq: "hourly",
        priority: 1.0,
      },
    ],
  },
});
