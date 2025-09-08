import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // spinner icon
import api from "../api/axiosConfig.js";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      if (res?.data?.success) {
        login(res.data.user);
        navigate("/dashboard"); // go to dashboard after login
      } else {
        alert(res.data.message || "Invalid Credentials");
      }
    } catch (err) {
      console.error("Login error", err);
      alert(err.response?.data?.message || "Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Welcome to <span className="text-blue-600">Stripe Gateway</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 p-3 rounded-lg font-semibold text-white shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && <Loader2 className="animate-spin w-5 h-5" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
     
      </motion.div>
    </div>
  );
}
