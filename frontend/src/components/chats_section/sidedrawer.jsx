import { X, LogOut } from "lucide-react"; // using lucide-react
import Sidebar from "../chats_section/sidebar";

export default function SidebarDrawer({ isOpen, onClose, onChatSelect }) {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-[#0a0f29] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        {/* Header */}
<div className="flex items-center justify-between relative">
  {/* Centered Title */}
  <div className="absolute left-1/2 transform -translate-x-1/2">
    <h2 className="text-xl font-bold text-yellow-400">Volt</h2>
  </div>

  {/* Right-side icons (logout + close) */}
  <div className="flex items-center gap-3 ml-auto">
    {/* 🔥 Logout icon (mobile only) */}
    <button
      onClick={handleLogout}
      className="text-gray-400 hover:text-red-500 transition md:hidden"
      aria-label="Logout"
    >
      <LogOut size={20} />
    </button>

    {/* Close Button */}
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-white"
      aria-label="Close drawer"
    >
      <X size={24} />
    </button>
  </div>
</div>

        {/* Sidebar content */}
        <Sidebar onChatSelect={onChatSelect} onProfileClick={onClose} />
      </div>
    </>
  );
}
