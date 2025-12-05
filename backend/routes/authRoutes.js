const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticateAccessToken } = require("../utils/jwtUtil");
const rateLimiter = require("../middleware/rateLimiter");

router.post("/register", authController.register);

router.post(
  "/login",
  rateLimiter({
    windowSeconds: 60,         // 1 minute
    maxRequests: 5,            // 1 minute me max 5 attempts
    keyPrefix: "rl:login",
    getKey: (req, ip) => {
      // IP + email dono milayenge, taaki thoda strict ho
      const email = req.body?.email || "no-email";
      return `login:${ip}:${email}`;
    },
  }),
  authController.login
);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

// Protected route
router.get("/me", authenticateAccessToken, authController.me);

module.exports = router;
