const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Signup = require('../../MongoDb/signupMongo/signupMongo');

require("dotenv").config();

const loginControl = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Signup.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = existingUser.token;

    // Set the cookie with HttpOnly and other attributes
    res.cookie('token', token, {
      httpOnly: false,
      secure: true, // Ensure secure flag is set in production
      sameSite: 'None', // Adjust this based on your requirements
      path: '/',
     
    });

    res.status(200).json({ message:"Login Successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginControl };
