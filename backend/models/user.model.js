const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false, // by default password result me nahi aayega
        },
        role: {
            type: String,
            enum: ["user", "notary", "admin"],
            default: "user",
        },
        // KYC / verification
        kycStatus: {
            type: String,
            enum: ["not_started", "pending", "verified", "rejected"],
            default: "not_started",
        },
        kycMethod: {
            type: String,
            enum: ["aadhaar", "passport", "none"],
            default: "none",
        },

        // Aadhaar ko kabhi plain mat store karna, ya toh last4 ya hash
        aadhaarLast4: String,
        country: {
            type: String,
            default: "IN",
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ✅ password hash before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ instance method for password compare
userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
