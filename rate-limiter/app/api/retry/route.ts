import { NextResponse } from "next/server";
import { processQueue } from "@/lib/worker";

export async function POST() {
  const users = ["user1", "user2"]; // demo

  for (const user of users) {
    await processQueue(user);
  }

  return NextResponse.json({ message: "Retry processed" });
}