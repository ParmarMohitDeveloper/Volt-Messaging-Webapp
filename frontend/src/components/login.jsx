import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./helper/helper"; // same helper you used for signup (axios instance)

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ POST request to backend
      const response = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      // ✅ Check if login successful
      if (response.status === 200 && response.data.token) {
        // Store token in localStorage
        localStorage.setItem("authToken", response.data.token);

        setMessage("Login successful! Redirecting...");
        
        // Redirect to chats after short delay
        setTimeout(() => {
          navigate("/chats");
        }, 1500);
      } else {
        setMessage("Unexpected response from server.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1333] flex flex-col justify-center items-center text-white px-4">
      <div className="bg-[#101942] p-8 rounded-xl w-full max-w-md shadow-lg border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 p-3 rounded-full text-black text-xl mb-2">📄</div>
          <h1 className="text-2xl font-bold">Volt</h1>
          <p className="text-gray-400 text-sm">Lightning-fast messaging at your fingertips</p>
        </div>

        <div className="flex bg-[#0d1333] rounded-lg mb-6">
          <a
            href="/login"
            className="flex-1 text-center py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg"
          >
            Log In
          </a>
          <a href="/signup" className="flex-1 text-center py-2 text-gray-400">
            Sign Up
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-400" /> Remember me
            </label>
            <a href="#" className="text-yellow-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-sm text-yellow-400">{message}</p>}
      </div>
    </div>
  );
}
