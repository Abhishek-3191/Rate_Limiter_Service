import { redis } from "./redis";

const LIMIT = 5;
const WINDOW = 60; // seconds

export async function checkRateLimit(userId: string) {
  const key = `rate_limit:${userId}`;

  // 👇 returns unknown
  const current = await redis.get(key);

  // 👇 safely convert
  const count =
    typeof current === "number"
      ? current
      : typeof current === "string"
      ? parseInt(current)
      : 0;

  if (count >= LIMIT) {
    return false;
  }

  // increment
  const newCount = await redis.incr(key);

  // set expiry first time
  if (newCount === 1) {
    await redis.expire(key, WINDOW);
  }

  return true;
}