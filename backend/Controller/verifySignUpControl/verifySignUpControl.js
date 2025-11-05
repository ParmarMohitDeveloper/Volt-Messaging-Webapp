const bcrypt = require('bcrypt');
const Signup = require('../../MongoDb/signupMongo/signupMongo');
const OtpServer = require('../../MongoDb/otpSaveMongo/otpSaveMongo');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // only need these now

    // 1️⃣ Check if OTP record exists and is valid
    const otpRecord = await OtpServer.findOne({
      token: email,
      otp,
      otpExpiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await Signup.findOne({ email: otpRecord.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3️⃣ Hash the stored password
    const hashedPassword = await bcrypt.hash(otpRecord.password, 12);

    // 4️⃣ Create and save new user
    const newUser = new Signup({
      email: otpRecord.email,
      name: otpRecord.name,
      password: hashedPassword,
      verified: true,
    });

    await newUser.save();

    // 5️⃣ Generate JWT
    const token = jwt.sign(
      { email: newUser.email, userId: newUser._id, name: newUser.name },
      process.env.JWT_SECRET
      
    );

    // Save token and delete OTP record
    newUser.token = token;
    await newUser.save();
    await OtpServer.deleteOne({ _id: otpRecord._id });

    // 6️⃣ Set token in cookie
    res.cookie('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'None',
      path: '/',
    });

    return res.status(200).json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Error verifying OTP and signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { verifyOTP };
