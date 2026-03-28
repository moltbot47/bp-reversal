import { NextRequest } from "next/server";

export async function parseJSON<T = Record<string, unknown>>(
  request: NextRequest
): Promise<{ data: T } | { error: Response }> {
  try {
    const data = await request.json();
    return { data: data as T };
  } catch {
    return {
      error: Response.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }
}
