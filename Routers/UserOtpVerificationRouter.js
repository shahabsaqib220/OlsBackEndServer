const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const Otp = require('../Models/UserOtpModel'); // OTP Model
const User = require('../Models/UserRegistrationModel'); 



router.post('/verify-otp', async (req, res) => {
    const { otp, email } = req.body;
  
    try {
      // Retrieve OTP from the database
      const otpRecord = await Otp.findOne({ email });
  
      if (!otpRecord) {
        return res.status(400).json({ code: 'OTP_NOT_FOUND', message: 'OTP not found or expired' });
      }
  
      // Check if the OTP has expired
      if (Date.now() > otpRecord.expiresIn) {
        await Otp.findOneAndDelete({ email }); // Delete expired OTP
        return res.status(400).json({ code: 'OTP_EXPIRED', message: 'OTP has expired' });
      }
  
      // Verify the OTP
      if (otp !== otpRecord.otp) {
        return res.status(400).json({ code: 'INVALID_OTP', message: 'Invalid OTP' });
      }
  
      // OTP is valid, proceed to the next step (e.g., account creation)
      await Otp.findOneAndDelete({ email });
  
      return res.json({ message: 'OTP verified successfully!' });
    } catch (error) {
      console.error('Error in verify-otp:', error);
      return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});


module.exports = router;
