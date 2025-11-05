import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/chats_section/sidebar";
import ChatWindow from "../components/chats_section/chatwindow";
import Profile from "../components/chats_section/profile";
import SidebarDrawer from "../components/chats_section/sidedrawer";

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activePage, setActivePage] = useState("chat");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔹 Common back handler
  const handleBack = () => {
    setActivePage("chat");
    setSelectedChat(null);
  };

  // 🔹 Handle when user clicks profile (either in drawer or sidebar)
  const handleProfileClick = () => {
    setActivePage("profile");
    setDrawerOpen(false); // close drawer if on mobile
  };

  // 🔹 Handle when user selects a chat
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setActivePage("chat");
    setDrawerOpen(false); // close drawer on mobile
  };

  return (
    <div className="flex h-screen bg-[#0d1333] text-white relative">
      {/* ---------- SIDEBAR (DESKTOP) ---------- */}
      <div className="hidden md:flex w-80 bg-[#101942] flex-col border-r border-gray-800">
        <Sidebar
          onProfileClick={handleProfileClick}
          onChatSelect={handleChatSelect}
        />
      </div>

      {/* ---------- MAIN AREA ---------- */}
      <div className="flex-1 flex flex-col bg-[#0b0f2a] border-l border-gray-800">
        {activePage === "profile" ? (
          <Profile onBack={handleBack} />
        ) : selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            onBack={handleBack}
            onChatSelect={handleChatSelect}
            onProfileClick={handleProfileClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 relative">
            {/* MOBILE HEADER WITH HAMBURGER */}
            <div className="absolute top-4 left-4 md:hidden">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-gray-400 hover:text-yellow-400 transition p-1"
                aria-label="Open menu"
              >
                <Menu size={26} />
              </button>
            </div>

            <p className="text-lg text-center px-8">
              Select a chat to start messaging ⚡
            </p>
          </div>
        )}
      </div>

      {/* ---------- SIDEBAR DRAWER (MOBILE) ---------- */}
      <SidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChatSelect={handleChatSelect}
        onProfileClick={handleProfileClick}
      />
    </div>
  );
}
