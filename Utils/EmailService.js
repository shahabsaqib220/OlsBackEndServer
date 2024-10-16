// utils/emailService.js

const nodemailer = require('nodemailer');

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service
  auth: {
    user: "shahabsaqib220@gmail.com", // Your email address
    pass: "nwpx mpvn wmtf irvm", // Your email password or app-specific password
  },
});

// Function to send email
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendEmail };
