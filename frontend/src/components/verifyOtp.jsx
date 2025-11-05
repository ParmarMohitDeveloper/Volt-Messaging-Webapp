import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./helper/helper";

export default function VerifyOtp({ email }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ for redirecting

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/verify/signup", {
        email,
        otp,
      });

      if (response.status === 200) {
        setMessage("Signup successful! Redirecting to login...");
        // ✅ redirect to login page after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1333] flex flex-col justify-center items-center text-white px-4">
      <div className="bg-[#101942] p-8 rounded-xl w-full max-w-md shadow-lg border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 p-3 rounded-full text-black text-xl mb-2">🔑</div>
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="text-gray-400 text-sm mt-1">Sent to {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="otp"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none text-center tracking-widest"
            placeholder="Enter 6-digit OTP"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all"
          >
            {loading ? "Verifying..." : "Verify & Sign Up"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-sm text-yellow-400">{message}</p>}
      </div>
    </div>
  );
}
