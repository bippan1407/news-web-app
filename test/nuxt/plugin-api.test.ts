import { describe, expect, it } from "vitest";

describe("api plugin", () => {
  it("provides $api on nuxt app", () => {
    const nuxtApp = useNuxtApp();

    expect(nuxtApp.$api).toBeDefined();
    expect(typeof nuxtApp.$api).toBe("function");
  });
});
