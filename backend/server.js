const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// DB connect
connectDB();

// 🔥 CORS (header-based auth)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3007",
      "https://ommdocumentation.com",
      "https://www.ommdocumentation.com",
      "https://admin.ommdocumentation.com",
      "https://www.admin.ommdocumentation.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Docker + Node.js + Redis + Header Auth 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
