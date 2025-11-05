const User = require('../../MongoDb/signupMongo/signupMongo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

// GET /api/user/me
const getMe = async (req, res) => {
  try {
    // req.user from auth middleware, expected { userId, email, name }
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) return res.status(400).json({ message: 'Invalid token payload' });

    const user = await User.findById(userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('getMe error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/user/update
// Accept multipart/form-data (image upload) OR JSON body with image url/base64
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) return res.status(400).json({ message: 'Invalid token payload' });

    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    // If multer stored a file
    if (req.file) {
      // Save path relative to server, or you can upload to cloud and store URL
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // optionally accept image URL or base64
      updateData.image = req.body.image;
    }

    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -__v');

    res.json({ message: 'Profile updated', user: updated });
  } catch (err) {
    console.error('updateProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, updateProfile };
