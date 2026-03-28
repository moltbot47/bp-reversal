import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/BP Reversal/);
  });

  test("displays hero section with CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Reverse High Blood Pressure")).toBeVisible();
    await expect(page.getByText("Start Free").first()).toBeVisible();
  });

  test("displays all 4 pillars", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Vascular", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Nervous", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Blood", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Kidney", exact: true })).toBeVisible();
  });

  test("displays how it works section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("How It Works")).toBeVisible();
    await expect(page.getByText("Sign up in seconds")).toBeVisible();
    await expect(page.getByText("Follow your daily checklist")).toBeVisible();
    await expect(page.getByText("Log your blood pressure")).toBeVisible();
  });

  test("Start Free CTA links to login", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByText("Start Free").first();
    await expect(cta).toHaveAttribute("href", "/login");
  });

  test("displays donate link to BMAC", async ({ page }) => {
    await page.goto("/");
    const donateLink = page.getByText("Support this project");
    await expect(donateLink).toHaveAttribute(
      "href",
      "https://buymeacoffee.com/dbutler"
    );
  });

  test("displays medical disclaimer in footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Not medical advice")).toBeVisible();
  });
});
