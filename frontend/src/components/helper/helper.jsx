import axios from "axios";
import { jwtDecode } from "jwt-decode";

// ✅ Base URL for your backend
export const BASE_URL = "http://localhost:3000";

// ✅ Preconfigured Axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important if using cookies
  headers: {
    "Content-Type": "application/json",
  },
});


// ✅ Auto-add token to headers
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("authToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ Auth helpers
export const getAuthToken = () => {
  return localStorage.getItem("authToken") || null;
};

export const getCurrentUser = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // Expected token payload: { userId, name, email }
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
