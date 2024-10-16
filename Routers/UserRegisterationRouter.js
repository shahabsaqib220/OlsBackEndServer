// routes/yourRouter.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../Models/UserOtpModel'); // OTP Model
const User = require('../Models/UserRegistrationModel'); // User model
const { sendEmail } = require('../Utils/EmailService'); // Import the sendEmail function
require('dotenv').config();

// POST /send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndDelete({ email });
    const newOtp = new Otp({ email, otp, expiresIn });
    await newOtp.save();

    // Respond first to avoid timeout
    res.json({ message: 'OTP generated successfully!' });

    // Then send the email asynchronously
    const mailOptions = {
      from: 'shahabsaqib220@gmail.com',
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
    };
    await sendEmail(mailOptions); // Send email after responding
  } catch (error) {
    console.error('Error in send-otp route:', error);
    return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});


module.exports = router;
