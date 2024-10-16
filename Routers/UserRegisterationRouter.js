const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const Otp = require('../Models/UserOtpModel'); // OTP Model
const User = require('../Models/UserRegistrationModel'); // User model
require('dotenv').config();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service (like Yahoo, Outlook, etc.)
  auth: {
    user: "shahabsaqib220@gmail.com", // Your email address from which OTP will be sent
    pass: "nwpx mpvn wmtf irvm", // Your email password or App-specific password for security
  },
});

// POST /send-otp
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (user) {
        console.log('User with email already exists:', email);
        return res.status(400).json({ message: 'Email already exists!' });
      }
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
      const expiresIn = new Date(Date.now() + 5 * 60 * 1000); 
  
      console.log(`Generated OTP: ${otp} for email: ${email}`);
  
      // If OTP already exists for this email, remove the old one
      await Otp.findOneAndDelete({ email });
  
      // Save the new OTP to the database
      const newOtp = new Otp({
        email,
        otp,
        expiresIn,
      });
  
      const savedOtp = await newOtp.save();  // Save OTP to the database
      console.log(`OTP saved to database for ${email}:`, savedOtp);
  
      // Send OTP email
      const mailOptions = {
        from: 'shahabsaqib220@gmail.com', // Sender address
        to: email, // Recipient email
        subject: 'Your OTP for Registration',
        text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
        console.log('Email sent: ' + info.response);
        return res.json({ message: 'OTP sent successfully!' });
      });
    } catch (error) {
      console.error('Error in send-otp route:', error);
      return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
  });











module.exports = router;
