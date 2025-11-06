const User = require('../../MongoDb/signupMongo/signupMongo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();



// helper to get full server URL (like http://localhost:3000)
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;


// ✅ GET /get/user
const getMe = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) return res.status(400).json({ message: 'Invalid token payload' });

    const user = await User.findById(userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const baseUrl = getBaseUrl(req);
    const fullImage = user.image ? `${baseUrl}${user.image}` : '';

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: fullImage,
      verified: user.verified,
    });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ PUT /update/user
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    if (!userId) return res.status(400).json({ message: 'Invalid token payload' });

    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    else if (req.body.image) updateData.image = req.body.image;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -__v');

    const baseUrl = getBaseUrl(req);
    const fullImage = updatedUser.image ? `${baseUrl}${updatedUser.image}` : '';

    res.json({
      message: 'Profile updated',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: fullImage,
        verified: updatedUser.verified,
      },
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMe, updateProfile };
