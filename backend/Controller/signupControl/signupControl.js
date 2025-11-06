const OtpServer = require('../../MongoDb/otpSaveMongo/otpSaveMongo');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Signup = require('../../MongoDb/signupMongo/signupMongo');
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Email Verification OTP',
    text: `Generated OTP for your signup: ${otp}. This will expire in 10 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Check if email already exists
    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    // Calculate expiration time (10 minutes from now)
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    // ✅ Store OTP + User details temporarily
    await OtpServer.create({
      token: email, // token field = email
      otp,
      otpExpiresAt: expirationTime,
      name,
      email,
      password, // temporarily store raw password until OTP is verified
    });

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// 🔹 Get All Users (Protected route)
const getAllUsers = async (req, res) => {
  try {
    // fetch all users except password and __v fields
    const users = await Signup.find().select("name email _id image verified");

    // construct full image URLs
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const updatedUsers = users.map((user) => ({
      ...user.toObject(),
      image: user.image ? `${baseUrl}${user.image}` : "",
    }));

    return res.status(200).json(updatedUsers);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};


// ✅ Export both functions properly
module.exports = { signup, getAllUsers };
