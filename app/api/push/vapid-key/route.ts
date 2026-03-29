export async function GET() {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!key || key === "placeholder") {
    return Response.json({ error: "Push not configured" }, { status: 503 });
  }
  return Response.json({ key });
}
