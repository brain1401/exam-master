import type { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

type Headers = Record<string, any>[];

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 2,
    ttl: options?.interval || 60000,
  });

  const headers = [] as Headers;
  return {
    check: async <T>(limit: number, token: string) =>
      new Promise<Headers>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        headers.push({ "X-RateLimit-Limit": limit });
        headers.push({
          "X-RateLimit-Remaining": isRateLimited ? 0 : limit - currentUsage,
        });

        return isRateLimited ? reject(headers) : resolve(headers);
      }),
  };
}
