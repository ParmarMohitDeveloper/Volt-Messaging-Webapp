const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatName: { type: String },
  isGroupChat: { type: Boolean, default: false },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Signup' }],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
