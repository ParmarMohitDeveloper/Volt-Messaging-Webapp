import { useEffect, useState } from "react";
import { api, getCurrentUser } from "../helper/helper";
import { socket, ensureSocketConnected } from "../socketio/socket";

export default function ChatList({ onChatSelect }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const me = getCurrentUser();

  // Fetch users (exclude current user)
  const fetchUsers = async () => {
    try {
      const res = await api.get("/get/all/users");
      const filtered = res.data.filter((u) => u._id !== me?.userId);
      setUsers(filtered);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    ensureSocketConnected();
    fetchUsers(); // initial load

    socket.on("onlineUsers", (ids) => setOnlineUsers(ids || []));

    // Refresh users every 5 seconds
    const interval = setInterval(fetchUsers, 5000);

    return () => {
      clearInterval(interval);
      socket.off("onlineUsers");
    };
  }, []);

  // Handle user selection (create or access chat)
  const handleSelectUser = async (user) => {
    try {
      const res = await api.post("/create/chat", { userId: user._id });
      onChatSelect(res.data);
    } catch (err) {
      console.error("Error creating/accessing chat:", err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {users.length === 0 ? (
        <div className="text-gray-400 text-center mt-8 sm:mt-10 px-4">
          <p className="text-sm sm:text-base">No other users available yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-800">
          {users.map((user) => {
            const isOnline = onlineUsers.includes(String(user._id));
            return (
              <div
                key={user._id}
                onClick={() => handleSelectUser(user)}
                className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-[#0d1333]/80 active:bg-[#0d1333] cursor-pointer transition-all duration-150 border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  {/* Avatar with Online Indicator */}
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#2a2f55] flex items-center justify-center text-yellow-400 font-bold text-sm sm:text-base">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#101942] animate-pulse" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {user.name || "Unknown User"}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Online Status */}
                <p
                  className={`text-xs font-medium whitespace-nowrap ${
                    isOnline ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}