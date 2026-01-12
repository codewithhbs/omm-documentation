const User = require("../models/user.model");
const { uploadPDF, deletePdfFromCloudinary } = require("../utils/Cloudnary");
const {
    signAccessToken,
    signRefreshToken,
    invalidateRefreshToken,
    isRefreshTokenValid,
} = require("../utils/jwtUtil");
const jwt = require("jsonwebtoken");
const generateOtp = require("../utils/otpHelper");
const sendEmail = require("../utils/SendEmail");

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";

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
            phone: user.phone,
            role: user.role,
            userName: user.userName,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: true,          // 🔥 REQUIRED for HTTPS
        //     sameSite: "none",      // 🔥 REQUIRED for cross-domain
        //     maxAge: 15 * 60 * 1000, // 15 minutes
        // });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true,          // 🔥 REQUIRED
        //     sameSite: "none",      // 🔥 REQUIRED
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });


        res.status(201).json({
            success: true,
            user: safeUser,
            sessionId: jti,
            accessToken,
            refreshToken
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
            phone: user.phone,
            role: user.role,
            userName: user.userName,
        };

        const accessToken = signAccessToken(safeUser);
        const { token: refreshToken, jti } = await signRefreshToken(user._id);

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: true,          // 🔥 REQUIRED for HTTPS
        //     sameSite: "none",      // 🔥 REQUIRED for cross-domain
        //     maxAge: 15 * 60 * 1000, // 15 minutes
        // });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: true,          // 🔥 REQUIRED
        //     sameSite: "none",      // 🔥 REQUIRED
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        // });


        res.status(201).json({
            success: true,
            user: safeUser,
            accessToken,
            refreshToken,
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
        console.log("🔄 Refresh token hit");

        // 1️⃣ Refresh token body ya header se lo
        const refreshToken =
            req.body.refreshToken || req.headers["x-refresh-token"];

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing",
            });
        }

        // 2️⃣ JWT verify
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const { sub: userId, jti } = decoded;

        // 3️⃣ Redis me validity check
        const isValid = await isRefreshTokenValid(jti);
        if (!isValid) {
            return res.status(403).json({
                success: false,
                message:
                    "Refresh token revoked (logged out from another device?)",
            });
        }

        // 4️⃣ User fetch (optional but recommended)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 5️⃣ Safe payload
        const safeUser = {
            _id: user._id,
            email: user.email,
            role: user.role || "user",
        };

        // 6️⃣ New access token
        const newAccessToken = signAccessToken(safeUser);

        // 7️⃣ JSON response (frontend store karega)
        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            user: safeUser, // optional
        });

    } catch (error) {
        console.error("❌ Refresh token error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during token refresh",
        });
    }
}

// ✅ Logout
async function logout(req, res) {
    try {
        // 1️⃣ refreshToken body ya header se lo
        const refreshToken =
            req.body.refreshToken ||
            req.headers["x-refresh-token"];

        if (!refreshToken) {
            return res.status(200).json({
                success: true,
                message: "Logged out (no refresh token found)",
            });
        }

        try {
            // 2️⃣ Verify refresh token
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            // 3️⃣ Redis / DB se invalidate
            await invalidateRefreshToken(decoded.jti);
        } catch (err) {
            // token expired / invalid → ignore
            console.warn("Refresh token invalid or expired");
        }

        // 4️⃣ Client-side clear karega
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
        });
    }
}

// ✅ Current user (requires access token)
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

        const { name, phone, familyName, address, country, advocateRegistrationNo, advocateJurisdiction, advocateExpireDate } = req.body;

        // Update user fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (familyName) user.familyName = familyName;
        if (address) user.address = address;
        if (country) user.country = country;
        if (advocateRegistrationNo) user.advocateRegistrationNo = advocateRegistrationNo;
        if (advocateJurisdiction) user.advocateJurisdiction = advocateJurisdiction;
        if (advocateExpireDate) user.advocateExpireDate = advocateExpireDate;

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
        // const safeUser = {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     userName: user.userName,
        //     phone: user.phone,
        //     familyName: user.familyName,
        //     address: user.address,
        //     country: user.country,
        //     userIdImage: user.userIdImage,
        //     role: user.role
        // };

        res.status(200).json({
            success: true,
            user: user,
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

// POST /api/auth/forgot-password
async function resetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        // 🔒 Security: same response even if user not found
        if (!user) {
            return res.json({
                success: true,
                message: "If this email exists, OTP has been sent",
            });
        }

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();

        // 📧 Email template
        const message = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6">
                <h2>Reset Your Password</h2>
                <p>Hello ${user.name || "User"},</p>
                <p>You requested to reset your password.</p>
                <p><strong>Your OTP is:</strong></p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br />
                <p>— Omm Documentation Team</p>
            </div>
        `;

        const emailSent = await sendEmail({
            email: user.email,
            subject: "Password Reset OTP - Omm Documentation",
            message,
        });

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again.",
            });
        }

        return res.json({
            success: true,
            message: "OTP has been sent to your email",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

// POST /api/auth/verify-reset-otp
async function verifyResetOtp(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email }).select("+password");

        if (
            !user ||
            !user.resetOtp ||
            user.resetOtp !== Number(otp)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (user.resetOtpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        user.password = newPassword; // pre-save hook will hash
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;

        await user.save();

        return res.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}


// admin-login
module.exports = {
    register,
    login,
    refreshToken,
    logout,
    me,
    profileUpdate,
    resetPassword,
    verifyResetOtp
};
