const User = require("../models/user.model");
const { uploadPDF, deletePdfFromCloudinary } = require("../utils/Cloudnary");
const {
    signAccessToken,
    signRefreshToken,
    invalidateRefreshToken,
    isRefreshTokenValid,
} = require("../utils/jwtUtil");
const jwt = require("jsonwebtoken");

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const AdvocateTimeSlot = require("../models/AdvocateTimeSlot.model");

async function register(req, res) {
    try {
        const { name, familyName, email, password, phone, userName, address, country, advocateRegistrationNo, advocateJurisdiction, advocateExpireDate } = req.body;
        const emptyField = [];
        if (!name) emptyField.push("name");
        if (!familyName) emptyField.push("familyName");
        if (!email) emptyField.push("email");
        if (!password) emptyField.push("password");
        if (!phone) emptyField.push("phone");
        if (!userName) emptyField.push("userName");
        if (!address) emptyField.push("address");
        if (!country) emptyField.push("country");
        if (!advocateRegistrationNo) emptyField.push("advocateRegistrationNo");
        if (!advocateJurisdiction) emptyField.push("advocateJurisdiction");
        if (!advocateExpireDate) emptyField.push("advocateExpireDate");
        if (emptyField.length > 0) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                emptyField
            });
        }
        const existing = await User.findOne({
            $or: [
                { email: email },
                { userName: userName }
            ]
        })

        if (existing) {
            if (existing.role === "notary") {
                if (existing.email === email) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already exists as a notary",
                    })
                } else if (existing.userName === userName) {
                    return res.status(409).json({
                        success: false,
                        message: "User name already exists as a notary",
                    })
                }
            } else {
                if (existing.email === email) {
                    return res.status(409).json({
                        success: false,
                        message: "Email already exists as a user",
                    })
                } else if (existing.userName === userName) {
                    return res.status(409).json({
                        success: false,
                        message: "User name already exists as a user",
                    })
                }
            }
        }

        const user = new User({
            name,
            familyName,
            email,
            password,
            phone,
            userName,
            address,
            country,
            advocateRegistrationNo,
            advocateJurisdiction,
            advocateExpireDate,
            role: "notary"
        });

        if (req.file) {
            const imageUrl = await uploadPDF(req.file.buffer);
            const { pdf, public_id } = imageUrl;
            user.userIdImage = {
                pdf,
                public_id
            }
        }

        await user.save();

        // const accessToken = signAccessToken(safeUser);
        // const { token: refreshToken, jti } = await signRefreshToken(user._id);
        res.status(201).json({
            success: true,
            user,
            message: "User created successfully",
            // accessToken,
            // refreshToken
        })
    } catch (error) {
        console.log("Internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function addTimeSlot(req, res) {
    try {
        const advocateId = req.user?.sub;
        const { date, startTime, endTime } = req.body;

        const user = await User.findById(advocateId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== "notary") {
            return res.status(403).json({ success: false, message: "Access denied. You do not have permission." });
        }

        const timeSlot = await AdvocateTimeSlot.create({ date, startTime, endTime, advocateId: advocateId });
        res.status(201).json({
            success: true,
            message: "Time slot created successfully",
            timeSlot
        })


    } catch (error) {
        console.log("Internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function getAdvocateTimeSlot(req, res) {
    try {
        const advocateId = req.user?.sub;
        const timeSlot = await AdvocateTimeSlot.find({ advocateId: advocateId });
        if (!timeSlot) {
            return res.status(404).json({ success: false, message: "Time slot not found" });
        }
        res.status(201).json({
            success: true,
            message: "Time slot created successfully",
            timeSlot
        })
    } catch (error) {
        console.log("Internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function deleteAdvocateTimeSlot(req, res) {
    try {
        const advocateId = req.user?.sub;
        const { id } = req.params;

        const timeSlot = await AdvocateTimeSlot.findOne({
            _id: id,
            advocateId: advocateId,
        });

        if (!timeSlot) {
            return res.status(404).json({
                success: false,
                message: "Time slot not found or unauthorized",
            });
        }

        await AdvocateTimeSlot.deleteOne({ _id: id });

        return res.status(200).json({
            success: true,
            message: "Time slot deleted successfully",
        });
    } catch (error) {
        console.error("Delete TimeSlot Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

async function getAdvocateDetails(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user || user.role !== "notary") {
            return res.status(404).json({ success: false, message: "Advocate not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Internal server error", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function getAllTimeSlots(req, res) {
    try {
        // ✅ Today's date at start of day (00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeSlotsRaw = await AdvocateTimeSlot.find({
            date: { $gte: today },
        })
            .populate("advocateId", "name familyName email")
            .sort({ date: 1, startTime: 1 });

        const seen = new Set();
        const timeSlots = timeSlotsRaw.filter(slot => {
            const key = `${slot.date.toISOString().split('T')[0]}-${slot.startTime}-${slot.endTime}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        if (timeSlots.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No upcoming time slots found",
            });
        }

        res.status(200).json({
            success: true,
            timeSlots,
        });
    } catch (error) {
        console.error("Internal server error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

async function checkTimeSlotAvailability(req, res) {
    try {
        const { date, startTime, endTime } = req.body;

        if (!date || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Date, startTime aur endTime sab required hain",
            });
        }

        const inputDate = new Date(date);
        if (isNaN(inputDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format",
            });
        }

        // ✅ DAY RANGE FIX
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);

        const matchingSlots = await AdvocateTimeSlot.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            startTime,
            endTime,
        })
            .populate("advocateId", "name familyName email")
            .sort({ createdAt: -1 });

        if (matchingSlots.length > 0) {
            return res.status(200).json({
                success: true,
                available: false,
                count: matchingSlots.length,
                timeSlots: matchingSlots,
            });
        }

        return res.status(200).json({
            success: true,
            available: true,
            count: 0,
            timeSlots: [],
        });

    } catch (error) {
        console.error("Error checking time slot:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


module.exports = {
    register,
    addTimeSlot,
    getAdvocateTimeSlot,
    deleteAdvocateTimeSlot,
    getAdvocateDetails,
    getAllTimeSlots,
    checkTimeSlotAvailability
};