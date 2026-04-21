import { redis } from "./redis";

export async function processQueue(userId: string) {
  const key = `queue:${userId}`;

  while (true) {
    const item = await redis.rpop(key);

    if (!item) break;

    // const data = JSON.parse(item);

    let data;

try {
  data = typeof item === "string" ? JSON.parse(item) : item;
} catch (err) {
  console.error("Invalid JSON in queue:", item);
  return;
}

    const now = Date.now();

    // 🚨 Check if it's time to process
    if (data.retryAt > now) {
      // ❌ Not ready yet → push back
      await redis.lpush(key, JSON.stringify(data));
      break;
    }

    // ✅ Process request
    console.log("Processing queued request:", data);

    // (Optional) update stats
    await redis.hincrby(`stats:${userId}`, "retried", 1);
  }
}