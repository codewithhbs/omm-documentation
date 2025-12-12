const User = require("../models/user.model");
const { uploadPDF,deletePdfFromCloudinary } = require("../utils/Cloudnary");
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
        console.log("i am hit")
        const { name, email, familyName, password, userName } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (!userName) {
            return res.status(400).json({
                success: false,
                message: "User name is required",
            });
        }

        const existing = await User.findOne({
            $or: [
                { email: email },
                { userName: userName }
            ]
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        const user = await User.create({
            name,
            familyName,
            userName,
            email,
            password,
            isVerified: true,
        });

        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role,
            userName: user.userName,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            user: safeUser,
            // sessionId: jti,
        });
    } catch (err) {
        console.error("Register error:", err);

        // Handle duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            const value = err.keyValue[field];

            let message = "User already exists";

            if (field === "email") {
                message = `User with email "${value}" already exists`;
            } else if (field === "userName" || field === "Username") {
                message = value ? `Username "${value}" is already taken` : "Username is required";
            } else if (field === "phone") {
                message = `User with phone number "${value}" already exists`;
            }

            return res.status(409).json({
                success: false,
                message: message,
                field: field
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
}

// ✅ Login
// POST /api/auth/login
async function login(req, res) {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                success: false,
                message: "UserName and password are required",
            });
        }

        // password field by default select: false hai, isliye +password
        const user = await User.findOne({ userName }).select("+password");
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
            name: user.name,
            email: user.email,
            role: user.role,
            userName: user.userName,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            user: safeUser,
            // accessToken,
            // refreshToken,
            sessionId: jti,
        })
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
}

// ✅ Refresh token
async function refreshToken(req, res) {
    try {
        console.log("i am here for refresh token")
        // 1. Refresh token cookie se lo (frontend se nahi bhejna padta)
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        // 2. JWT verify karo
        let decoded = null;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            // Token expired ya invalid
            return res.status(403).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const { sub: userId, jti } = decoded;

        // 3. Redis mein check karo ki ye refresh token abhi bhi valid hai (logout nahi hua)
        const isValid = await isRefreshTokenValid(jti);
        if (!isValid) {
            return res.status(403).json({
                success: false,
                message: "Refresh token revoked (logged out from another device?)",
            });
        }

        // 4. User ko database se lao (optional – agar latest role/avatar chahiye)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 5. Naya access token banao
        const safeUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role || "user",
        };

        const newAccessToken = signAccessToken(safeUser);

        // 6. Naya access token cookie mein set kar do (15 min ka)
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // 7. Success response (koi token JSON mein nahi bhej rahe!)
        return res.json({
            success: true,
            message: "Token refreshed successfully",
            // user: safeUser   ← optional, agar frontend ko latest data chahiye
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during token refresh",
        });
    }
}

// ✅ Logout
// POST /api/auth/logout
async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
                await invalidateRefreshToken(decoded.jti); // ← Redis se hata do
            } catch (err) {
                // ignore expired token
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ success: true });
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

        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

async function profileUpdate(req, res) {
    try {
        const userId = req.user?.sub;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { name, phone, familyName, address, country } = req.body;

        // Update user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (familyName) user.familyName = familyName;
        if (address) user.address = address;
        if (country) user.country = country;

        // Handle file upload
        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (user.userIdImage?.public_id) {
                try {
                    await deletePdfFromCloudinary(user.userIdImage.public_id);
                } catch (err) {
                    console.error('Failed to delete old image:', err);
                }
            }

            // Upload new file using buffer
            const imageUrl = await uploadPDF(req.file.buffer);
            const { pdf, public_id } = imageUrl;
            
            user.userIdImage = {
                pdf: pdf,
                public_id: public_id
            };
        }

        await user.save();

        // Return safe user data (without password)
        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            userName: user.userName,
            phone: user.phone,
            familyName: user.familyName,
            address: user.address,
            country: user.country,
            userIdImage: user.userIdImage,
            role: user.role
        };

        res.status(200).json({ 
            success: true, 
            user: safeUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me,
    profileUpdate
};
