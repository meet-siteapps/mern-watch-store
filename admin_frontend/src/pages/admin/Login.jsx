import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdminLogin() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  
  try {
    if (!values.username || !values.password) {
      setError("Please enter both username and password");
      return;
    }
    
    setLoading(true);
    
    const response = await api.post("/sign-in", values);
    
    if (response.data && response.data.token && response.data.username) {
      // Check if user has admin role
      if (response.data.role !== 'admin') {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
      
      console.log("Admin login successful:", response.data);
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");

      // Refresh tab after navigation
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      setError("Invalid response from server");
    }
  } catch (err) {
    console.error("Login error:", err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || "Login failed. Please check your credentials.";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-800 to-black text-white relative overflow-hidden pt-24 pb-24">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 blur-3xl animate-pulse-slow"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-90 p-10 rounded-3xl shadow-2xl border border-gray-700 transform transition-transform duration-500 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-gray-400 mt-2">Sign in to your admin account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your admin username"
              value={values.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your admin password"
              value={values.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6 text-sm">
            <label className="flex items-center text-gray-300">
              <input 
                type="checkbox" 
                className="mr-2 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition duration-300 relative overflow-hidden ${
              loading 
                ? "bg-gradient-to-r from-gray-700 to-gray-600 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:brightness-110"
            }`}
          >
            {/* Glow Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-30 blur-xl filter animate-pulse-slow"></span>
            {/* Button Text */}
            <span className="relative z-10">
              {loading ? "Logging in..." : "Login to Admin Panel"}
            </span>
          </button>
        </form>

        {/* Back to Home Link */}
        <p className="mt-6 text-center text-gray-300">
          Not an admin?{" "}
          <Link
            to="/"
            className="relative px-2 py-1 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-gradient-to-r before:from-blue-400 before:via-cyan-400 before:to-blue-400 before:transition-all before:duration-300 hover:before:w-full"
          >
            Back to Store
          </Link>
        </p>
      </div>
    </section>
  );
}