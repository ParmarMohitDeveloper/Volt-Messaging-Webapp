import { useState } from "react";
import { Send } from "lucide-react";

export default function MessageInput({ onSend }) {
  const [msg, setMsg] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    onSend(msg);
    setMsg("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 sm:gap-3 border-t border-gray-800 bg-[#0d1333] p-3 sm:p-4"
    >
      {/* Message Input */}
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-300 placeholder-gray-500 caret-yellow-400"
        autoFocus={false}
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!msg.trim()}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2.5 sm:p-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#0d1333]"
        aria-label="Send message"
      >
        <Send size={16} sm={{ size: 18 }} color="black" className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </form>
  );
}