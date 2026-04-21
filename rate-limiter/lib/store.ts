type Stats = {
  success: number;
  blocked: number;
};

export const userRequests = new Map<string, number[]>();
export const userStats = new Map<string, Stats>();

// simple per-user lock
const locks = new Map<string, Promise<void>>();

export async function acquireLock(userId: string) {
  while (locks.get(userId)) {
    await locks.get(userId);
  }

  let release!: () => void;
  const lock = new Promise<void>((res) => (release = res));

  locks.set(userId, lock);

  return () => {
    locks.delete(userId);
    release();
  };
}