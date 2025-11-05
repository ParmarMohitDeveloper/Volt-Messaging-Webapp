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
// Also used by socket to persist incoming messages
const postMessage = async (req, res) => {
  try {
    const senderId = req.user?.userId || req.user?.id || req.user?._id;
    const { chatId, content } = req.body;
    if (!chatId || !content) return res.status(400).json({ message: 'chatId and content required' });

    const msg = await Message.create({ sender: senderId, chat: chatId, content });

    // Update latestMessage in Chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id }, { new: true });

    const fullMessage = await Message.findById(msg._id).populate('sender', '-password -__v');

    res.status(201).json(fullMessage);
  } catch (err) {
    console.error('postMessage error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMessages, postMessage };
