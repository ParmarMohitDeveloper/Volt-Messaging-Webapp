import ChatList from "../chats_section/chatlist";

export default function Sidebar({ onProfileClick, onChatSelect }) {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f29] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-700 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400 whitespace-nowrap">
          Volt
        </h1>
        <button
          onClick={onProfileClick}
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
          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-md bg-[#0d1333] text-gray-300 placeholder-gray-500 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
      </div>

      {/* Chat List - Takes remaining space */}
      <div className="flex-1 overflow-y-auto">
        <ChatList onChatSelect={onChatSelect} />
      </div>

      {/* Logout Button - Pinned to bottom */}
      <div className="p-3 sm:p-4 mt-auto border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 sm:py-2.5 rounded-md font-semibold text-sm sm:text-base hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}