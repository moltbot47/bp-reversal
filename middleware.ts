import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();

  // Add request timing header
  const duration = Date.now() - start;
  response.headers.set("X-Response-Time", `${duration}ms`);

  // Log API requests in structured format
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const logEntry = {
      method: request.method,
      path: request.nextUrl.pathname,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "production") {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(
        `[${logEntry.timestamp}] ${logEntry.method} ${logEntry.path} ${logEntry.duration}`
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
