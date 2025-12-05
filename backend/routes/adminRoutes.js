const express = require("express");
const router = express.Router();

const { authenticateAccessToken, authorizeRoles } = require("../utils/jwtUtil");
const User = require("../models/user.model");

// 👇 Ye route sirf admin ke liye hai
router.get(
  "/users",
  authenticateAccessToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json({
        success: true,
        count: users.length,
        users,
      });
    } catch (err) {
      console.error("Admin /users error:", err.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

module.exports = router;
