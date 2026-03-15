export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: "/api",
    onRequest({ options }) {
      // Auth token can be injected here when needed:
    },
    onResponseError({ response }) {
      // Handle global errors e.g. redirect to login on 401:
    },
  });

  return { provide: { api } };
});
