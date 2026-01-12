const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mainPrice: {
        type: Number,
        required: true
    },
    discountPercentage: {
        type: Number
    },
    finalPrice: {
        type: Number,
        required: true
    },
    features: [
        {
            type: String
        }
    ],
    additionalSign: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;