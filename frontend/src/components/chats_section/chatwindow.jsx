import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { api, getCurrentUser } from "../helper/helper";
import io from "socket.io-client";
import MessageInput from "../chats_section/messageinput";
import SidebarDrawer from "../chats_section/sidedrawer";

const SOCKET_URL = "http://localhost:3000";
let socket;

export default function ChatWindow({ chat, onBack, onChatSelect, onProfileClick }) {
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const messageEndRef = useRef();
  const me = getCurrentUser();

  // ---------- SOCKET SETUP ----------
  useEffect(() => {
    if (!chat?._id) return;

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("authToken") },
    });

    socket.on("connect", () => setSocketConnected(true));
    socket.on("message received", (newMessage) => {
      if (newMessage.chat._id === chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStopTyping", () => setIsTyping(false));

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [chat]);

  // ---------- FETCH MESSAGES + POLLING ----------
  useEffect(() => {
    if (!chat?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/get/msg/${chat._id}`);
        setMessages(res.data);
        socket.emit("join chat", chat._id);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chat]);

  // ---------- SEND MESSAGE ----------
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    try {
      const res = await api.post("/create/msg", {
        content: msg,
        chatId: chat._id,
      });
      socket.emit("new message", res.data);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ---------- TYPING HANDLER ----------
  const handleTyping = (isTypingNow) => {
    if (!socketConnected) return;

    if (isTypingNow && !typing) {
      setTyping(true);
      socket.emit("typing", { chatId: chat._id, userId: me?.userId });
    } else if (!isTypingNow && typing) {
      setTyping(false);
      socket.emit("stopTyping", { chatId: chat._id, userId: me?.userId });
    }
  };

  // ---------- SCROLL TO BOTTOM ----------
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------- CHAT NAME ----------
  const getChatName = () => {
    if (chat.chatName && chat.chatName !== "Direct Chat") return chat.chatName;
    const otherUser = chat.users?.find((u) => u._id !== me?.userId);
    return otherUser ? otherUser.name : "Chat";
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1333] text-white">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-800 bg-[#101942] gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Hamburger for mobile */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition p-1"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition p-1"
            aria-label="Go back"
          >
            <ArrowLeft size={22} />
          </button>

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base sm:text-lg truncate">
              {getChatName()}
            </h2>
            <p className="text-xs sm:text-sm text-green-400">
              {isTyping
                ? "Typing..."
                : socketConnected
                ? "Active now"
                : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- MESSAGES AREA ---------- */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender?._id === me?.userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm max-w-[75%] sm:max-w-xs break-words shadow-sm ${
                msg.sender?._id === me?.userId
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium"
                  : "bg-[#1b213f] text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* ---------- MESSAGE INPUT ---------- */}
      <MessageInput onSend={sendMessage} onTyping={handleTyping} />

      {/* ---------- SIDEBAR DRAWER (MOBILE) ---------- */}
      <SidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChatSelect={onChatSelect}
        onProfileClick={onProfileClick}
      />
    </div>
  );
}
