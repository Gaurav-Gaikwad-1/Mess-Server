//OTP generated during forward password process will into this collection
const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    otp: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true })

OTPSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 60 * 5 });

module.exports = mongoose.model('OTP', OTPSchema);