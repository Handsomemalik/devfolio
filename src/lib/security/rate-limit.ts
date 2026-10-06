/**
 * Rate Limiting Utility
 * In-memory sliding window rate limiter with interface matching Upstash Redis.
 * Protects auth endpoints, view counting, and upload operations against brute force and abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit: number;      // Maximum allowed requests within the window
  windowMs: number;   // Window size in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  totalHits: number;
}

/**
 * Checks and records a rate limit hit for a given identifier key.
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.limit) {
    const oldest = record.timestamps[0] || now;
    const resetAt = oldest + options.windowMs;
    return {
      success: false,
      remaining: 0,
      resetAt,
      totalHits: record.timestamps.length,
    };
  }

  // Record current hit
  record.timestamps.push(now);

  return {
    success: true,
    remaining: Math.max(0, options.limit - record.timestamps.length),
    resetAt: now + options.windowMs,
    totalHits: record.timestamps.length,
  };
}

// Cleanup stale memory records periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - 3600000; // 1 hour ago
    for (const [k, v] of memoryStore.entries()) {
      if (v.timestamps.length === 0 || v.timestamps[v.timestamps.length - 1] < cutoff) {
        memoryStore.delete(k);
      }
    }
  }, 300000);
}
