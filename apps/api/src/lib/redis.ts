import Redis from "ioredis";

export const redis = new (Redis as unknown as { new (uri?: string): any })(
  process.env.REDIS_URL || "redis://localhost:6379"
);
