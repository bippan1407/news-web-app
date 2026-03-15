import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import App from "../../app/app.vue";

describe("App", () => {
  it("renders NuxtLayout and NuxtPage", async () => {
    const wrapper = await mountSuspended(App);

    expect(wrapper.html()).toBeTruthy();
  });
});
