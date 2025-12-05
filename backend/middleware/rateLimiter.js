const redis = require("../utils/redisClient");

// windowSeconds: kitne time ka window
// maxRequests: us window me kitni requests allowed
// keyPrefix: redis key ka prefix
// getKey: optional function custom key banane ke liye (IP + email, etc.)
function rateLimiter({
  windowSeconds = 60,
  maxRequests = 30,
  keyPrefix = "rl",
  getKey,
} = {}) {
  return async function (req, res, next) {
    try {
      const ip =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";

      // default key: route + ip
      let key = `${keyPrefix}:${req.path}:${ip}`;

      // agar custom key builder mila hai to uska use karo
      if (typeof getKey === "function") {
        key = `${keyPrefix}:${getKey(req, ip)}`;
      }

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }

      if (current > maxRequests) {
        const ttl = await redis.ttl(key);
        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
          retryAfterSeconds: ttl,
        });
      }

      next();
    } catch (err) {
      console.error("RateLimiter error:", err.message);
      // Redis down ho to request allow kar do
      next();
    }
  };
}

module.exports = rateLimiter;
