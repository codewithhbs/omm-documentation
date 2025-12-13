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

// 🔹 CORS Configuration (FIXED)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, mobile apps, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // Return exact origin
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,                    // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Extra: Handle preflight requests explicitly (recommended)
app.options("*", cors());

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

// 🔹 Global error handler (optional but good practice)
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