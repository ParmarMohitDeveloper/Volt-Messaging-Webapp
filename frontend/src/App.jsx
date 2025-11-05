import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import HomePage from "./components/homePage";
import SignUp from "./components/signUp";
import VerifyOtp from "./components/verifyOtp";
import ChatsPage from "./components/chatsPage";
import ChatList from "./components/chats_section/chatlist";
import ChatWindow from "./components/chats_section/chatwindow";
import MessageInput from "./components/chats_section/messageinput";
import Profile from "./components/chats_section/profile";
import Sidebar from "./components/chats_section/sidebar";




function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<HomePage />} />

      <Route path="/SignUp" element={<SignUp />} />

      <Route path="/verifyOtp" element={<VerifyOtp />} />

      <Route path="/chats" element={<ChatsPage />} />
      <Route path="/chat/list" element={<ChatList />} />
      <Route path="/chat/window" element={<ChatWindow />} />
      <Route path="/chat/msginput" element={<MessageInput />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/sidebar" element={<Sidebar />} />



      
    </Routes>
  );
}

export default App;
