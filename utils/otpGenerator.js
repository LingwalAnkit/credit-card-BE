const crypto = require("crypto");

const otpGenerator = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6 digit ki otp
};

module.exports = otpGenerator;
