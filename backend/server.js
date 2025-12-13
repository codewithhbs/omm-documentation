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

// 🔹 Allowed origins (IMPORTANT)
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3007",
  "https://ommdocumentation.com",
  "https://www.ommdocumentation.com",
  "https://admin.ommdocumentation.com",
  "https://www.admin.ommdocumentation.com",
];

// 🔹 CORS CONFIG (PRODUCTION SAFE)
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // ✅ NOT "*"
      } else {
        return callback(
          new Error("CORS not allowed for this origin")
        );
      }
    },
    credentials: true, // 🔥 REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Handle preflight requests explicitly
app.options("*", cors());

// 🔹 Other middlewares
app.use(express.json());
app.use(cookieParser());

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
