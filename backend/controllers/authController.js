const User = require("../models/user.model");
const {
    signAccessToken,
    signRefreshToken,
    invalidateRefreshToken,
    isRefreshTokenValid,
} = require("../utils/jwtUtil");
const jwt = require("jsonwebtoken");

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

// ✅ Register / Signup
// POST /api/auth/register
async function register(req, res) {
    try {
        const { name, email, password, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            isVerified: true, // abhi ke liye direct verified, baad me OTP/email verification add karenge
        });

        // user object jo token me jayega
        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        res.status(201).json({
            success: true,
            user: safeUser,
            accessToken,
            refreshToken,
            sessionId: jti,
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
}

// ✅ Login
// POST /api/auth/login
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // password field by default select: false hai, isliye +password
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        res.json({
            success: true,
            user: safeUser,
            accessToken,
            refreshToken,
            sessionId: jti,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
}

// ✅ Refresh token
// POST /api/auth/refresh-token
async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "Refresh token required" });
        }

        // pehle JWT verify
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch (err) {
            console.error("Refresh token verify error:", err.message);
            return res.status(401).json({ success: false, message: "Invalid refresh token" });
        }

        const { sub: userId, jti } = decoded;

        // Redis se session check
        const valid = await isRefreshTokenValid(jti);
        if (!valid) {
            return res.status(401).json({ success: false, message: "Session expired or invalid" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };

        const newAccessToken = signAccessToken(safeUser);

        res.json({
            success: true,
            accessToken: newAccessToken,
        });
    } catch (err) {
        console.error("Refresh token error:", err);
        res.status(500).json({ success: false, message: "Server error during refresh" });
    }
}

// ✅ Logout
// POST /api/auth/logout
async function logout(req, res) {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: "sessionId required" });
        }

        await invalidateRefreshToken(sessionId);

        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ success: false, message: "Server error during logout" });
    }
}

// ✅ Current user (requires access token)
// GET /api/auth/me
async function me(req, res) {
    try {
        const userId = req.user?.sub;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me,
};
