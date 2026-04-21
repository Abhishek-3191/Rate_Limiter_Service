import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import { redis } from "@/lib/redis";

const RETRY_DELAY = 60; // seconds

export async function POST(req: NextRequest) {
  const { user_id, payload } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const allowed = await checkRateLimit(user_id);

  const statsKey = `stats:${user_id}`;

  if (!allowed) {
    // 👇 Add to queue
   await redis.lpush(
  `queue:${user_id}`,
  JSON.stringify({
    payload,
    retryAt: Date.now() + RETRY_DELAY * 1000, // 👈 important
  })
);

    await redis.hincrby(statsKey, "blocked", 1);

    return NextResponse.json({
      message: "Queued due to rate limit",
    });
  }

  await redis.hincrby(statsKey, "success", 1);

  return NextResponse.json({
    message: "Request processed",
    payload,
  });
}