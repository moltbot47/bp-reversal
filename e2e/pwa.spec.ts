import { test, expect } from "@playwright/test";

test.describe("PWA", () => {
  test("manifest.json is accessible and valid", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest.name).toBe("BP Reversal");
    expect(manifest.short_name).toBe("BP Reversal");
    expect(manifest.start_url).toBe("/today");
    expect(manifest.display).toBe("standalone");
    expect(manifest.background_color).toBe("#EEEFE9");
    expect(manifest.theme_color).toBe("#EEEFE9");
    expect(manifest.icons).toHaveLength(2);
  });

  test("service worker is accessible", async ({ request }) => {
    const response = await request.get("/sw.js");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("push");
    expect(text).toContain("notificationclick");
    expect(text).toContain("bp-reversal");
  });

  test("has apple-mobile-web-app meta tags", async ({ page }) => {
    await page.goto("/");
    const capable = await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute("content");
    expect(capable).toBe("yes");
  });
});
