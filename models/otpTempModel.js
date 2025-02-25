const mongoose = require("mongoose");

const otpTempSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  otp: { type: String, required: true },
  otpExpires: { type: Date, required: true },
});

module.exports = mongoose.model("OtpTemp", otpTempSchema);
