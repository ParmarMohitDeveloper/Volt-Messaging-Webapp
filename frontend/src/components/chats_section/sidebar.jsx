import ChatList from "../chats_section/chatlist";
import { LogOut, X } from "lucide-react";
import { useState } from "react";
import Profile from "../chats_section/profile"; // ✅ import your Profile component

export default function Sidebar({ onProfileClick, onChatSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="relative flex flex-col h-full bg-[#0a0f29] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-700 gap-3 sm:gap-0">
        <button
          onClick={() => {
            // ✅ On mobile open profile drawer, on desktop call existing profile logic
            if (window.innerWidth < 768) setShowMobileProfile(true);
            else onProfileClick();
          }}
          className="bg-yellow-400 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-yellow-300 transition whitespace-nowrap"
        >
          Profile
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-3 sm:px-4 py-2 sm:py-3">
        <input
          type="text"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-md bg-[#0d1333] text-gray-300 placeholder-gray-500 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <ChatList onChatSelect={onChatSelect} searchTerm={searchTerm} />
      </div>

      {/* Logout (Desktop Only) */}
      <div className="hidden md:block p-4 border-t border-gray-700 mt-auto">
        <button
          onClick={handleLogout}
          className="
            w-full bg-red-600 text-white 
            py-3 rounded-lg font-medium text-base 
            hover:bg-red-700 active:bg-red-800 
            transition-shadow duration-150 
            shadow-md active:shadow-sm
            focus:outline-none focus:ring-2 focus:ring-red-500
          "
        >
          Logout
        </button>
      </div>

      {/* ✅ MOBILE PROFILE DRAWER */}
      {showMobileProfile && (
        <div className="fixed inset-0 z-50 bg-[#0b1126] bg-opacity-95 flex flex-col">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-yellow-400">Profile</h2>
            <button
              onClick={() => setShowMobileProfile(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close profile"
            >
              <X size={22} />
            </button>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto">
            <Profile onBack={() => setShowMobileProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
