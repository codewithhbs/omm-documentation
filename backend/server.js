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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (Postman, curl)
      if (!origin) {
        return callback(null, false); // 🔴 CHANGE HERE
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // ✅ explicit origin
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
