const mongoose = require('mongoose');

const otpSave = new mongoose.Schema({
  token: {
    type: String, // Usually the email
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiresAt: {
    type: Date,
    required: true,
  },
  // ✅ Temporarily store signup data
  name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model('OtpSave', otpSave);
