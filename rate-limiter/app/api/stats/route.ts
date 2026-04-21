import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET() {
  const keys = await redis.keys("stats:*");

  const result: any = {};

  for (const key of keys) {
    const userId = key.split(":")[1];
    const stats = await redis.hgetall(key);
    result[userId] = stats;
  }

  return NextResponse.json(result);
}