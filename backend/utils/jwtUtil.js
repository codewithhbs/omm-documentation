const jwt = require("jsonwebtoken");
const redis = require("./redisClient");

const ACCESS_TOKEN_TTL = "15m";              // JWT ka expire time
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 din

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

// ✅ Access token banane ka helper
function signAccessToken(user) {
  // user: {_id, email, role, ...}
  const payload = {
    sub: user._id?.toString() || user.id,
    email: user.email,
    role: user.role || "user",
  };

  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

// ✅ Refresh token banane ka helper + Redis me store
async function signRefreshToken(userId) {
  const jti = `sess:${userId}:${Date.now()}`; // unique id
  const payload = { sub: userId, jti };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
  });

  // Redis me session store karo
  await redis.set(`refresh:${jti}`, userId.toString(), "EX", REFRESH_TOKEN_TTL_SECONDS);

  return { token, jti };
}

// ✅ Refresh token ko invalidate (logout)
async function invalidateRefreshToken(jti) {
  await redis.del(`refresh:${jti}`);
}

// ✅ Refresh token valid hai ya nahi (Redis se check)
async function isRefreshTokenValid(jti) {
  const userId = await redis.get(`refresh:${jti}`);
  return !!userId;
}

// ✅ Access token verify middleware
function authenticateAccessToken(req, res, next) {
  const token = req.cookies.accessToken; // ← cookie se lo

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// ---- Role-based authorization middleware ----
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No role found.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
}


module.exports = {
  signAccessToken,
  signRefreshToken,
  invalidateRefreshToken,
  isRefreshTokenValid,
  authenticateAccessToken,
  authorizeRoles,
};
