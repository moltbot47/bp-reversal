import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("loads login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("BP Reversal")).toBeVisible();
    await expect(page.getByText("Sign in to track your 90-day protocol")).toBeVisible();
  });

  test("shows email input and submit button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByText("Sign in with email")).toBeVisible();
  });

  test("submit button is disabled without email", async ({ page }) => {
    await page.goto("/login");
    const button = page.getByRole("button", { name: /sign in with email/i });
    await expect(button).toBeDisabled();
  });

  test("submit button enables with valid email", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("test@example.com");
    const button = page.getByRole("button", { name: /sign in with email/i });
    await expect(button).toBeEnabled();
  });

  test("shows no password message", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("No password needed")).toBeVisible();
  });
});
