const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("../utils/otpGenerator");
const sendOTP = require("../config/mailer");
const OtpTemp = require("../models/otpTempModel");


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const otp = otpGenerator();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Temporary Store for Otp
    await OtpTemp.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent for verification", email });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins ke liye valid
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempUser = await OtpTemp.findOne({ email });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid request, please register again" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (tempUser.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Create user in actual database after OTP verification
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    await newUser.save();
    await OtpTemp.deleteOne({ email }); // Remove temp data after successful verification

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "OTP verified successfully", token });

  } catch (error) {
    console.error("OTP Verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

