

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const Otp = require('../Models/UserOtpModel'); // OTP Model
const User = require('../Models/UserRegistrationModel'); // User model
require('dotenv').config();


router.post('/register', async (req, res) => {
    const { name, email, password, securityQuestions } = req.body;
  
    try {
      // Hash the password (bcrypt automatically generates a salt internally)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = new User({
        name,
        email,
        password, // Save the hashed password
        securityQuestions, // Save security questions
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Optional: Clear OTP after successful registration
      await Otp.findOneAndDelete({ email });
  
      return res.json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
  });

  module.exports = router;
