import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();
  let dbStatus = "ok";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRawUnsafe("SELECT 1");
    dbLatencyMs = Date.now() - dbStart;
  } catch {
    dbStatus = "error";
  }

  const uptime = process.uptime();
  const totalLatency = Date.now() - start;

  return Response.json({
    status: dbStatus === "ok" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: Math.round(uptime),
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    },
    latencyMs: totalLatency,
    version: process.env.npm_package_version || "0.1.0",
  });
}
