const jwt = require("jsonwebtoken");
const Message = require("../MongoDb/messageMongo/messageMongo");
const Chat = require("../MongoDb/chatMongo/chatMongo");
const User = require("../MongoDb/signupMongo/signupMongo");

// ✅ Global Map for online users (userId -> socketId)
const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    try {
      // 🔹 Extract token from handshake
      const { token } = socket.handshake.auth || {};

      if (!token) {
        console.log("❌ No token provided during socket connection");
        socket.disconnect();
        return;
      }

      // 🔹 Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password -__v");

      if (!user) {
        console.log("❌ Invalid user in socket setup");
        socket.disconnect();
        return;
      }

      // Attach user to socket for later reference
      socket.user = user;

      // Join personal room for direct events
      socket.join(user._id.toString());

      // ✅ Add to online users map
      onlineUsers.set(user._id.toString(), socket.id);

      // Broadcast updated list of online users to everyone
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log(`✅ Socket authenticated: ${user.name || user.email}`);

      // ✅ Event: Join a specific chat room
      socket.on("join chat", (chatId) => {
        if (!chatId) return;
        socket.join(chatId);
        console.log(`👥 ${user.name || "User"} joined chat: ${chatId}`);
      });

      // ✅ Event: New message
      socket.on("new message", async (newMessage) => {
        try {
          const { content, chatId } = newMessage;

          if (!content || !chatId) return;

          // Create and populate the message
          const msg = await Message.create({
            sender: user._id,
            chat: chatId,
            content,
          });

          const fullMsg = await Message.findById(msg._id)
            .populate("sender", "name email")
            .populate("chat");

          // Update chat with latest message
          await Chat.findByIdAndUpdate(chatId, { latestMessage: msg._id });

          // Populate chat users
          const chat = await Chat.findById(chatId).populate("users", "name email");

          if (chat?.users) {
            chat.users.forEach((u) => {
              if (u._id.toString() === user._id.toString()) return;

              // Send to user’s personal room
              socket.to(u._id.toString()).emit("message received", fullMsg);
            });
          }

          console.log(`💬 Message sent in chat ${chatId}`);
        } catch (err) {
          console.error("❌ Error handling new message:", err);
        }
      });

      // ✅ Typing indicators
      socket.on("typing", ({ chatId, userId }) => {
        socket.to(chatId).emit("userTyping", { chatId, userId });
      });

      socket.on("stopTyping", ({ chatId, userId }) => {
        socket.to(chatId).emit("userStopTyping", { chatId, userId });
      });

      // ✅ Handle disconnection
      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);

        // Remove user from online map
        if (user?._id) {
          onlineUsers.delete(user._id.toString());
          io.emit("onlineUsers", Array.from(onlineUsers.keys())); // broadcast updated list
        }
      });
    } catch (err) {
      console.error("❌ Socket authentication error:", err.message);
      socket.disconnect();
    }
  });
};
