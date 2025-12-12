const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// DB connect
connectDB();

// Middleware - Configure CORS before other middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Your frontend URL
  credentials: true, // Allow cookies if needed
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Docker + Node.js + Redis + Auth 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});