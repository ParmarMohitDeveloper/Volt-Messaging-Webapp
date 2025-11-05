const Chat = require('../../MongoDb/chatMongo/chatMongo');
const User = require('../../MongoDb/signupMongo/signupMongo');
const Message = require('../../MongoDb/messageMongo/messageMongo');

// GET /api/chats  -> list chats for current user
const getChats = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    const chats = await Chat.find({ users: userId })
      .populate('users', '-password -__v')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error('getChats error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chats  -> create or return existing 1:1 chat
// body: { userId }  => other user's id for 1:1
const accessChat = async (req, res) => {
  try {
    const currentUserId = req.user?.userId || req.user?.id || req.user?._id;
    const { userId } = req.body; // other user
    if (!userId) return res.status(400).json({ message: 'userId required' });

    // Check if a 1:1 chat exists
    let chat = await Chat.findOne({ isGroupChat: false, users: { $all: [currentUserId, userId] } })
      .populate('users', '-password -__v')
      .populate('latestMessage');

    if (chat) return res.json(chat);

    // Otherwise create
    const newChat = await Chat.create({
      chatName: 'Direct Chat',
      users: [currentUserId, userId],
      isGroupChat: false
    });

    chat = await Chat.findById(newChat._id).populate('users', '-password -__v');

    res.status(201).json(chat);
  } catch (err) {
    console.error('accessChat error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getChats, accessChat };
