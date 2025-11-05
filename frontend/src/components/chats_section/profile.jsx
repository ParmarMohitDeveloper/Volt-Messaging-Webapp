import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { api } from "../helper/helper";

export default function Profile({ onBack }) {
  const [user, setUser] = useState({ name: "", email: "", image: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load user from backend or fallback to localStorage/JWT
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No token found");

        const res = await api.get("/get/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        localStorage.setItem("userData", JSON.stringify(res.data));
      } catch (err) {
        console.warn("Backend fetch failed, using fallback:", err);
        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("userData");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          try {
            const decoded = jwtDecode(token);
            setUser({
              name: decoded.name || "User",
              email: decoded.email || "unknown@example.com",
              image: decoded.image || "",
            });
          } catch (error) {
            console.error("Invalid token:", error);
          }
        }
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle name input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const imageURL = URL.createObjectURL(file);
      setUser({ ...user, image: imageURL });
    }
  };

  // ✅ Save changes (name + image upload)
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      formData.append("name", user.name);
      if (newImage) formData.append("image", newImage);

      const res = await api.put("/update/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setIsEditing(false);
      localStorage.setItem("userData", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-6 overflow-y-auto bg-[#0b1126] text-white transition-all duration-500">
      {/* Header */}
      <div className="flex items-center w-full max-w-md mb-4">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-yellow-400 md:hidden"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-center flex-1">Profile</h2>
      </div>

      {/* Card */}
      <div className="bg-[#101942] p-8 rounded-xl shadow-lg text-center w-full max-w-md border border-gray-700">
        {/* Profile Image */}
        <div className="relative">
          <img
            src={user.image || "/src/asset/user.png"}
            alt="profile"
            className="w-24 h-24 rounded-full mx-auto mb-3 border-2 border-yellow-400 object-cover"
          />
          {isEditing && (
            <label
              htmlFor="imageUpload"
              className="absolute bottom-2 right-[43%] bg-yellow-400 text-black text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-yellow-300"
            >
              Change
            </label>
          )}
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name & Email */}
        {isEditing ? (
          <div className="space-y-3 mt-3">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-[#0d1333] border border-gray-600 text-white outline-none"
              placeholder="Enter your name"
            />
            <button
              onClick={handleSave}
              disabled={loading}
              className={`${
                loading ? "opacity-60 cursor-not-allowed" : ""
              } bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-1 px-4 rounded-lg w-full`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-1 px-4 rounded-lg mt-3"
            >
              Edit Profile
            </button>
          </>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
