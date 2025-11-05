// src/components/SidebarDrawer.jsx
import { X } from "lucide-react";
import Sidebar from "../chats_section/sidebar";   // your existing Sidebar (contains ChatList)

export default function SidebarDrawer({ isOpen, onClose, onChatSelect }) {
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
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-400">Volt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar content (ChatList + logout) */}
        <Sidebar onChatSelect={onChatSelect} onProfileClick={onClose} />
      </div>
    </>
  );
}