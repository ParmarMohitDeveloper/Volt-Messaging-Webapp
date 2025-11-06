const Chat = require('../../MongoDb/chatMongo/chatMongo');
const User = require('../../MongoDb/signupMongo/signupMongo');
const Message = require('../../MongoDb/messageMongo/messageMongo');

// GET /api/messages/:chatId
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .populate('sender', '-password -__v')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('getMessages error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/messages
// body: { chatId, content }
const postMessage = async (req, res) => {
  try {
    const senderId = req.user?.userId || req.user?.id || req.user?._id;
    const { chatId, content } = req.body;
    if (!chatId || !content) return res.status(400).json({ message: 'chatId and content required' });

    const msg = await Message.create({ sender: senderId, chat: chatId, content });

    // Update latestMessage in Chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id }, { new: true });

    const fullMessage = await Message.findById(msg._id)
      .populate('sender', '-password -__v');

    res.status(201).json(fullMessage);
  } catch (err) {
    console.error('postMessage error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/messages/:messageId  (edit within 2 minutes)
const editMessage = async (req, res) => {
  try {
    const senderId = req.user?.userId || req.user?.id || req.user?._id;
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'content required' });
    }

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    if (String(msg.sender) !== String(senderId)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    if (msg.isDeleted) {
      return res.status(400).json({ message: 'Cannot edit a deleted message' });
    }

    // 2-minute edit window
    const twoMinutes = 2 * 60 * 1000;
    if (Date.now() - msg.createdAt.getTime() > twoMinutes) {
      return res.status(400).json({ message: 'Edit window closed (2 minutes)' });
    }

    msg.content = content.trim();
    msg.editedAt = new Date();
    await msg.save();

    const populated = await Message.findById(messageId).populate('sender', '-password -__v');
    res.json(populated);
  } catch (err) {
    console.error('editMessage error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/messages/:messageId (unsend for everyone - soft delete)
const deleteMessage = async (req, res) => {
  try {
    const senderId = req.user?.userId || req.user?.id || req.user?._id;
    const { messageId } = req.params;

    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    if (String(msg.sender) !== String(senderId)) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    if (msg.isDeleted) {
      return res.status(200).json({ ok: true }); // already deleted
    }

    msg.isDeleted = true;
    msg.content = '';     // scrub content
    msg.editedAt = null;  // clear edit flag
    await msg.save();

    const populated = await Message.findById(messageId).populate('sender', '-password -__v');
    res.json(populated);
  } catch (err) {
    console.error('deleteMessage error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, postMessage, editMessage, deleteMessage };
