const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    console.log(`Email user ${process.env.EMAIL_USER}`)
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Here is you otp code for authentication",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
