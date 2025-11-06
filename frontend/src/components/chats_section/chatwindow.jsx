import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import { api, getCurrentUser, BASE_URL } from "../helper/helper";
import io from "socket.io-client";
import MessageInput from "../chats_section/messageinput";
import SidebarDrawer from "../chats_section/sidedrawer";

const SOCKET_URL = BASE_URL;
let socket;

export default function ChatWindow({ chat, onBack, onChatSelect, onProfileClick }) {
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [otherUserData, setOtherUserData] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const messageEndRef = useRef();
  const messagesContainerRef = useRef();
  const me = getCurrentUser();

  // util: format time as HH:mm (e.g., 07:42 PM)
  const formatTime = (iso) => {
    const d = new Date(iso);
    let hh = d.getHours();
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ampm = hh >= 12 ? "PM" : "AM";
    hh = hh % 12;
    if (hh === 0) hh = 12;
    return `${String(hh).padStart(2, "0")}:${mm} ${ampm}`;
  };

  // util: can edit within 2 minutes
  const canEdit = (msg) => {
    if (!msg || !msg.createdAt) return false;
    if (msg.isDeleted) return false;
    if ((msg.sender?._id || msg.sender) !== me?.userId) return false;
    const created = new Date(msg.createdAt).getTime();
    return Date.now() - created <= 2 * 60 * 1000;
  };

  // ---------- SOCKET SETUP ----------
  useEffect(() => {
    if (!chat?._id) return;

    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("authToken") },
    });

    socket.on("connect", () => setSocketConnected(true));

    socket.on("message received", (newMessage) => {
      const incomingChatId = newMessage?.chat?._id || newMessage?.chat;
      if (incomingChatId === chat._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socket.on("message edited", (updated) => {
      const incomingChatId = updated?.chat?._id || updated?.chat;
      if (incomingChatId === chat._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      }
    });

    socket.on("message deleted", (updated) => {
      const incomingChatId = updated?.chat?._id || updated?.chat;
      if (incomingChatId === chat._id) {
        setMessages((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      }
    });

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStopTyping", () => setIsTyping(false));

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [chat]);

  // ---------- FETCH MESSAGES ----------
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
      setMessages((prev) => [...prev, res.data]);
      socket.emit("new message", res.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ---------- EDIT MESSAGE ----------
  const startEditing = (message) => {
    setEditingMessageId(message._id);
    setEditContent(message.content);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const saveEdit = async (message) => {
    if (!editContent.trim() || editContent === message.content) {
      cancelEditing();
      return;
    }
    try {
      const res = await api.patch(`/update/msg/${message._id}`, {
        content: editContent.trim(),
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? res.data : m))
      );
      socket.emit("message edited", res.data);
      cancelEditing();
    } catch (err) {
      console.error("Error editing message:", err);
      alert(err?.response?.data?.message || "Failed to edit");
    }
  };

  // ---------- DELETE MESSAGE (Instant) ----------
  const deleteMyMessage = async (message) => {
    try {
      const res = await api.delete(`/delete/msg/${message._id}`);
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? res.data : m))
      );
      socket.emit("message deleted", res.data);
    } catch (err) {
      console.error("Error deleting message:", err);
      alert(err?.response?.data?.message || "Failed to delete");
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

  // ---------- SCROLL ----------
  const scrollToBottom = () => {
    // ✅ no smooth scrolling (mobile-friendly)
    messageEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(scrollToBottom, [messages]);

  const getOtherUser = () =>
    chat.users?.find((u) => u._id !== me?.userId);

  const otherUser = getOtherUser();

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        if (!otherUser?._id) return;
        const res = await api.get("/get/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOtherUserData(
          res.data._id === otherUser._id ? res.data : otherUser
        );
      } catch {
        setOtherUserData(otherUser);
      }
    };
    fetchOtherUser();
  }, [otherUser]);

  return (
    <div className="flex flex-col h-full bg-[#0d1333] text-white">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-800 bg-[#101942] gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition p-1"
          >
            <Menu size={24} />
          </button>
          <button
            onClick={onBack}
            className="md:hidden text-gray-400 hover:text-yellow-400 transition p-1"
          >
            <ArrowLeft size={22} />
          </button>
          {otherUserData && (
            <div className="flex items-center gap-3 min-w-0">
              {otherUserData.image ? (
                <img
                  src={
                    otherUserData.image.startsWith("http")
                      ? otherUserData.image
                      : `${BASE_URL}${otherUserData.image}`
                  }
                  alt={otherUserData.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center text-base uppercase">
                  {otherUserData.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <h2 className="font-semibold text-base sm:text-lg truncate">
                  {otherUserData.name || "Chat"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {isTyping
                    ? "Typing..."
                    : socketConnected
                    ? "Connected"
                    : "Connecting..."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- MESSAGES ---------- */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-3"
        style={{ overscrollBehavior: "contain" }}
      >
        {messages.map((msg) => {
          const mine = (msg.sender?._id || msg.sender) === me?.userId;
          const timeStr = msg.createdAt ? formatTime(msg.createdAt) : "";
          const isEditing = editingMessageId === msg._id;

          return (
            <div
              key={msg._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[80%] sm:max-w-xs">
                <div
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm break-words shadow-sm ${
                    mine
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-medium"
                      : "bg-[#1b213f] text-white"
                  }`}
                >
                  {/* Inline Editing */}
                  {msg.isDeleted ? (
                    <span
                      className={`${
                        mine ? "text-black/70" : "text-gray-300"
                      } italic`}
                    >
                      Message deleted
                    </span>
                  ) : isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent outline-none border-b border-yellow-400 text-xs sm:text-sm text-black"
                      />
                      <button
                        onClick={() => saveEdit(msg)}
                        className="text-green-500 hover:text-green-600"
                        title="Save"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-500"
                        title="Cancel"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Meta info row */}
                <div
                  className={`mt-1 flex items-center gap-2 ${
                    mine ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {timeStr}
                  </span>
                  {!msg.isDeleted && msg.editedAt && (
                    <span className="text-[10px] sm:text-xs text-gray-400">
                      (edited)
                    </span>
                  )}
                  {mine && !msg.isDeleted && (
                    <div className="flex items-center gap-2">
                      {!isEditing && canEdit(msg) && (
                        <button
                          onClick={() => startEditing(msg)}
                          className="text-gray-300 hover:text-yellow-400"
                          title="Edit"
                        >
                          <FaEdit size={13} />
                        </button>
                      )}
                      {!isEditing && (
                        <button
                          onClick={() => deleteMyMessage(msg)}
                          className="text-gray-300 hover:text-yellow-400"
                          title="Delete"
                        >
                          <FaTrash size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* ---------- MESSAGE INPUT ---------- */}
      <div className="sticky bottom-0 bg-[#0d1333] px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-800">
        <MessageInput onSend={sendMessage} onTyping={handleTyping} />
      </div>

      {/* ---------- SIDEBAR DRAWER ---------- */}
      <SidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChatSelect={onChatSelect}
        onProfileClick={onProfileClick}
      />
    </div>
  );
}
