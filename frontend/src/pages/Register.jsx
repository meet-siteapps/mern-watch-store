// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
    
    // Validate all fields
    if (
      values.username === "" ||
      values.email === "" ||
      values.password === "" ||
      confirmPassword === ""
    ) {
      setError("All fields are required");
      return;
    }
    
    // Validate passwords match
    if (values.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Validate password length
    if (values.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Validate terms agreement
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API call with Axios
      const response = await axios.post(
        "http://localhost:3000/sign-up",
        values
      );
      
      console.log("Registration response:", response.data);
      
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Extract error message from response if available
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-800 to-black text-white relative overflow-hidden pt-24 pb-24">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10 blur-3xl animate-pulse-slow"></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 bg-opacity-90 p-10 rounded-3xl shadow-2xl border border-gray-700 transform transition-transform duration-500 hover:scale-105">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join Lux Watches today</p>
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
              placeholder="Enter your username"
              value={values.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={values.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-400 mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6 flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 mr-2 rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
            />
            <label htmlFor="terms" className="text-gray-300 text-sm">
              I agree to the{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Register Button */}
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
              {loading ? "Creating Account..." : "Register"}
            </span>
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="relative px-2 py-1 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-gradient-to-r before:from-blue-400 before:via-cyan-400 before:to-blue-400 before:transition-all before:duration-300 hover:before:w-full"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}