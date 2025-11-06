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

      // ===============================================================
      // 🔸 JOIN CHAT
      // ===============================================================
      socket.on("join chat", (chatId) => {
        if (!chatId) return;
        socket.join(chatId);
        console.log(`👥 ${user.name || "User"} joined chat: ${chatId}`);
      });

      // ===============================================================
      // 🔸 NEW MESSAGE (handled here as well as via REST)
      // ===============================================================
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
              socket.to(u._id.toString()).emit("message received", fullMsg);
            });
          }

          console.log(`💬 Message sent in chat ${chatId}`);
        } catch (err) {
          console.error("❌ Error handling new message:", err);
        }
      });

      // ===============================================================
      // 🔸 EDIT MESSAGE (within 2 minutes)
      // ===============================================================
      socket.on("edit message", async ({ messageId, content }) => {
        try {
          if (!messageId || !content?.trim()) return;

          const msg = await Message.findById(messageId);
          if (!msg) return console.log("⚠️ Message not found for edit");
          if (msg.isDeleted) return;
          if (msg.sender.toString() !== user._id.toString()) return;

          // enforce 2-minute window
          const twoMinutes = 2 * 60 * 1000;
          if (Date.now() - msg.createdAt.getTime() > twoMinutes) {
            console.log("⏰ Edit window expired for message:", messageId);
            return;
          }

          msg.content = content.trim();
          msg.editedAt = new Date();
          await msg.save();

          const updated = await Message.findById(messageId)
            .populate("sender", "name email")
            .populate("chat");

          // Notify everyone in the chat
          io.to(updated.chat._id.toString()).emit("message edited", updated);

          console.log(`✏️ Message edited: ${messageId}`);
        } catch (err) {
          console.error("❌ Error editing message:", err);
        }
      });

      // ===============================================================
      // 🔸 DELETE / UNSEND MESSAGE
      // ===============================================================
      socket.on("delete message", async ({ messageId }) => {
        try {
          if (!messageId) return;

          const msg = await Message.findById(messageId);
          if (!msg) return console.log("⚠️ Message not found for delete");
          if (msg.isDeleted) return;
          if (msg.sender.toString() !== user._id.toString()) return;

          msg.isDeleted = true;
          msg.content = "";
          msg.editedAt = null;
          await msg.save();

          const deleted = await Message.findById(messageId)
            .populate("sender", "name email")
            .populate("chat");

          io.to(deleted.chat._id.toString()).emit("message deleted", deleted);

          console.log(`🗑️ Message deleted: ${messageId}`);
        } catch (err) {
          console.error("❌ Error deleting message:", err);
        }
      });

      // ===============================================================
      // 🔸 TYPING INDICATORS
      // ===============================================================
      socket.on("typing", ({ chatId, userId }) => {
        socket.to(chatId).emit("userTyping", { chatId, userId });
      });

      socket.on("stopTyping", ({ chatId, userId }) => {
        socket.to(chatId).emit("userStopTyping", { chatId, userId });
      });

      // ===============================================================
      // 🔸 DISCONNECT
      // ===============================================================
      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);

        if (user?._id) {
          onlineUsers.delete(user._id.toString());
          io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        }
      });
    } catch (err) {
      console.error("❌ Socket authentication error:", err.message);
      socket.disconnect();
    }
  });
};
