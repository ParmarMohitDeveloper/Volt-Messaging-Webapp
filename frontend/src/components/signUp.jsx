import { useState } from "react";
import { api } from "./helper/helper";
import VerifyOtp from "./verifyOtp";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/signup", {
        email: form.email,
        name: form.name,
        password: form.password,
      });

      if (response.status === 200) {
        setOtpSent(true);
        setMessage("OTP sent to your email. Please verify to complete signup.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If OTP was sent successfully, show VerifyOtp component
  if (otpSent) {
    return <VerifyOtp email={form.email} />;
  }

  return (
    <div className="min-h-screen bg-[#0d1333] flex flex-col justify-center items-center text-white px-4">
      <div className="bg-[#101942] p-8 rounded-xl w-full max-w-md shadow-lg border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-400 p-3 rounded-full text-black text-xl mb-2">📄</div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Volt to start chatting instantly</p>
        </div>

        {/* ✅ Added the same Login/Signup switcher */}
        <div className="flex bg-[#0d1333] rounded-lg mb-6">
          <a
            href="/login"
            className="flex-1 text-center py-2 text-gray-400 rounded-lg"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="flex-1 text-center py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg"
          >
            Sign Up
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="John Doe"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-[#0d1333] border border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-yellow-500/40 transition-all"
          >
            {loading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        {message && <p className="text-center mt-4 text-sm text-yellow-400">{message}</p>}

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
