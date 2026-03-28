import { test, expect } from "@playwright/test";

test.describe("Health Endpoint", () => {
  test("returns healthy status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("healthy");
    expect(body.checks.database.status).toBe("ok");
    expect(body.checks.database.latencyMs).toBeGreaterThan(0);
    expect(body.version).toBe("0.1.0");
    expect(body.timestamp).toBeTruthy();
  });
});
