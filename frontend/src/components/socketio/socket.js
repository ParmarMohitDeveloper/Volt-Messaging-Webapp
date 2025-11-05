import { io } from "socket.io-client";
import { getAuthToken } from "../helper/helper";

export const SOCKET_URL = "https://volt-messaging-webapp-backend.onrender.com/"; // same as your backend

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: { token: getAuthToken() },
});

export function ensureSocketConnected() {
  if (!socket.connected) {
    socket.connect();
  }
}
