// src/pages/Hero.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WelcomeBanner from "../components/WelcomeBanner";

export default function Hero() {
  const videoId = "L1JoUErVauw";
  const location = useLocation();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [user, setUser] = useState(null);

  // Scroll to top when component mounts (on refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Get user data from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "null");
    setUser(userData);
  }, []);

  // Check if user just logged in and show welcome banner after 1 second delay
  useEffect(() => {
    // Check if user exists and we haven't shown the welcome banner yet
    if (user && !hasShownWelcome) {
      // Check if user recently logged in (within the last 5 seconds)
      const loginTime = user.loginTime || 0;
      const currentTime = new Date().getTime();

      // If login was within the last 5 seconds, show welcome banner after 1 second delay
      if (currentTime - loginTime < 5000) {
        // Add 1 second delay before showing the banner
        const showTimer = setTimeout(() => {
          setShowWelcomeBanner(true);
          setHasShownWelcome(true);

          // Auto-hide after 5 seconds
          const hideTimer = setTimeout(() => {
            setShowWelcomeBanner(false);
          }, 5000);

          return () => clearTimeout(hideTimer);
        }, 1000); // 1 second delay

        return () => clearTimeout(showTimer);
      }
    }
  }, [user, hasShownWelcome]);

  const handleCloseWelcomeBanner = () => {
    setShowWelcomeBanner(false);
  };

  return (
    <>
      {/* Welcome Banner - appears after login with 1 second delay */}
      {showWelcomeBanner && (
        <WelcomeBanner user={user} onClose={handleCloseWelcomeBanner} />
      )}

      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Fixed Discount and Offer Strip - Below navbar */}
        <div className="fixed top-16 left-0 w-full bg-gradient-to-r from-blue-900/90 to-black/90 py-1 sm:py-2 z-30 overflow-hidden shadow-lg">
          <div className="flex w-max animate-marquee">
            {/* Offer 1 */}
            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2 animate-pulse">
                ⏱️
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 font-semibold text-sm sm:text-base">
                Summer Sale: 30% OFF
              </span>
              <span className="ml-1 sm:ml-2 text-yellow-300 text-xs sm:text-sm animate-bounce">
                🔥
              </span>
            </div>

            {/* Offer 2 */}
            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">🚚</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 font-semibold text-sm sm:text-base">
                Free Shipping on $500+
              </span>
              <span className="ml-1 sm:ml-2 text-green-300 text-xs sm:text-sm">
                ✨
              </span>
            </div>

            {/* Offer 3 */}
            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">🆕</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-500 font-semibold text-sm sm:text-base">
                New Collection: Exclusive
              </span>
              <span className="ml-1 sm:ml-2 text-purple-300 text-xs sm:text-sm animate-pulse">
                💎
              </span>
            </div>

            {/* Offer 4 */}
            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">⏳</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-500 font-semibold text-sm sm:text-base">
                Limited Edition: 20% OFF
              </span>
              <span className="ml-1 sm:ml-2 text-red-300 text-xs sm:text-sm">
                ⏰
              </span>
            </div>

            {/* Duplicate for seamless loop */}
            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2 animate-pulse">
                ⏱️
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 font-semibold text-sm sm:text-base">
                Summer Sale: 30% OFF
              </span>
              <span className="ml-1 sm:ml-2 text-yellow-300 text-xs sm:text-sm animate-bounce">
                🔥
              </span>
            </div>

            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">🚚</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500 font-semibold text-sm sm:text-base">
                Free Shipping on $500+
              </span>
              <span className="ml-1 sm:ml-2 text-green-300 text-xs sm:text-sm">
                ✨
              </span>
            </div>

            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">🆕</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-500 font-semibold text-sm sm:text-base">
                New Collection: Exclusive
              </span>
              <span className="ml-1 sm:ml-2 text-purple-300 text-xs sm:text-sm animate-pulse">
                💎
              </span>
            </div>

            <div className="flex items-center mx-3 sm:mx-6 group">
              <span className="text-sm sm:text-xl mr-1 sm:mr-2">⏳</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-500 font-semibold text-sm sm:text-base">
                Limited Edition: 20% OFF
              </span>
              <span className="ml-1 sm:ml-2 text-red-300 text-xs sm:text-sm">
                ⏰
              </span>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Orbs - responsive sizes */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-pink-500/10 to-yellow-500/10 blur-3xl animate-pulse"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px] sm:bg-[length:40px_40px]"></div>

          {/* Background Video */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&iv_load_policy=3&rel=0`}
            className="w-full h-full object-cover brightness-90"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Background Video"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 pt-16 pb-20 w-full">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 sm:w-32 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

          {/* Heading with glow + animated underline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg relative inline-block group mb-6 sm:mb-8">
            <span className="relative z-10">Timeless Luxury</span>
            {/* Soft blue halo glow */}
            <span className="absolute inset-0 blur-lg text-blue-400 opacity-30 select-none">
              Timeless Luxury
            </span>
            {/* Underline */}
            <span className="block h-[2px] sm:h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 absolute left-1/2 -translate-x-1/2 bottom-[-10px] sm:bottom-[-14px] w-0 animate-underline group-hover:w-full"></span>
          </h1>

          {/* Subtitle with typewriter effect */}
          <div className="relative mb-8 sm:mb-10">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 drop-shadow-md max-w-2xl mx-auto px-2">
              Explore our handpicked collection of iconic watches that define{" "}
              <span className="text-blue-400 font-semibold">elegance</span>.
            </p>
            <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12 max-w-3xl mx-auto px-2">
            <div
              className="bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-700/50 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-blue-400 mb-2">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                Authentic
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                100% genuine luxury watches
              </p>
            </div>

            <div
              className="bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-700/50 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-blue-400 mb-2">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                Limited Edition
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Exclusive timepieces available
              </p>
            </div>

            <div
              className="bg-black/30 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-gray-700/50 animate-fadeIn sm:col-span-2 lg:col-span-1"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="text-blue-400 mb-2">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">
                Worldwide
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Free shipping globally
              </p>
            </div>
          </div>

          {/* Button with pulsing blue glow */}
          <div className="relative inline-block mb-8 w-full max-w-xs mx-auto sm:max-w-[200px] md:max-w-[200px] lg:max-w-[200px]">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-lg opacity-70 animate-pulse"></div>
            <Link
              to="/products"
              className="relative px-6 py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(59,130,246,0.8)] hover:scale-105 flex items-center justify-center gap-2 w-full text-sm sm:text-sm"
            >
              Shop Collection
              <svg
                className="w-4 h-4 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>

        {/* Add animation styles */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes underline {
            0% { width: 0; }
            100% { width: 100%; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-underline {
            animation: underline 1s ease-in-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
            opacity: 0;
          }
          .animate-pulse {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          /* Mobile-specific adjustments */
          @media (max-width: 640px) {
            .bg-grid-white/[0.05] {
              background-size: 20px 20px;
            }
          }
        `}</style>
      </section>
    </>
  );
}
