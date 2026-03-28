import { test, expect } from "@playwright/test";

test.describe("API Auth Protection", () => {
  test("GET /api/checklist returns 401 without session", async ({ request }) => {
    const response = await request.get("/api/checklist");
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  test("POST /api/checklist returns 401 without session", async ({ request }) => {
    const response = await request.post("/api/checklist", {
      data: { slug: "test", completed: true },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/bp-log returns 401 without session", async ({ request }) => {
    const response = await request.get("/api/bp-log");
    expect(response.status()).toBe(401);
  });

  test("POST /api/bp-log returns 401 without session", async ({ request }) => {
    const response = await request.post("/api/bp-log", {
      data: { systolic: 120, diastolic: 80, period: "AM" },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/dashboard returns 401 without session", async ({ request }) => {
    const response = await request.get("/api/dashboard");
    expect(response.status()).toBe(401);
  });

  test("GET /api/reminders returns 401 without session", async ({ request }) => {
    const response = await request.get("/api/reminders");
    expect(response.status()).toBe(401);
  });

  test("POST /api/onboarding returns 401 without session", async ({ request }) => {
    const response = await request.post("/api/onboarding", {
      data: { name: "Test", wakeUpTime: "06:00" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /api/push/subscribe returns 401 without session", async ({ request }) => {
    const response = await request.post("/api/push/subscribe", {
      data: { subscription: {} },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/auth/providers returns resend provider", async ({ request }) => {
    const response = await request.get("/api/auth/providers");
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.resend).toBeTruthy();
    expect(body.resend.type).toBe("email");
  });
});

test.describe("Cron Auth Protection", () => {
  test("GET /api/cron/send-reminders returns 401 without CRON_SECRET", async ({ request }) => {
    const response = await request.get("/api/cron/send-reminders");
    expect(response.status()).toBe(401);
  });

  test("GET /api/cron/daily-reset returns 401 without CRON_SECRET", async ({ request }) => {
    const response = await request.get("/api/cron/daily-reset");
    expect(response.status()).toBe(401);
  });
});
