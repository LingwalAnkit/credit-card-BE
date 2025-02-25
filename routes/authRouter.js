const express = require("express");
const { register, login , verifyOtp } = require("../controllers/authController");
const { createCreditCard, getCreditCards } = require("../controllers/cardController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/card", authMiddleware, createCreditCard);
router.get("/cards", authMiddleware, getCreditCards);


module.exports = router;
