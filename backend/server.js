const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// 🔹 DB connect
connectDB();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3007",
  "https://ommdocumentation.com",
  "https://www.ommdocumentation.com",
  "https://admin.ommdocumentation.com",
  "https://www.admin.ommdocumentation.com",
];

// 🔹 CORS Configuration (PROPER FIX)
app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser requests (Postman, curl) → allow with wildcard (*)
      if (!origin) {
        return callback(null, true);
      }

      // Browser requests → check whitelist and reflect exact origin
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);  // ✅ Exact origin set
      }

      // Not allowed
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,  // Cookies ke liye zaruri
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Middlewares
app.use(express.json());
app.use(cookieParser());

// 🔹 Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Global error handler (optional)
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: "CORS policy violation" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Server Error" });
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});