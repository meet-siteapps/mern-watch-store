// src/components/Navbar.jsx
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { CartContext } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext";
import Logo from "./Logo"; // Import the updated Logo component

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const favoritesContext = useFavorites() || { favorites: [] };
  const { favorites } = favoritesContext;
  const cartContext = useContext(CartContext);
  const cartItems = cartContext?.cartItems || [];  
  const { user, logout } = useUser();
  
  // Calculate total items in cart and favorites
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites?.length || 0;
  
  // Animation states for badges
  const [cartAnimate, setCartAnimate] = useState(false);
  const [favoritesAnimate, setFavoritesAnimate] = useState(false);
  
  // Trigger animation when counts change
  useEffect(() => {
    setCartAnimate(true);
    const timer = setTimeout(() => setCartAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [totalCartItems]);
  
  useEffect(() => {
    setFavoritesAnimate(true);
    const timer = setTimeout(() => setFavoritesAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [favoritesCount]);

  // Menu items with icons
  const links = [
    { 
      name: "Home", 
      to: user ? "/" : "/", // Updated to redirect to profile if user is logged in
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      badge: 0 
    },
    { 
      name: "Products", 
      to: "/products", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      badge: 0 
    },
    { 
      name: "Cart", 
      to: "/cart", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: totalCartItems 
    },
  ];

  // User menu items
  const userLinks = user ? [
    { 
      name: "Profile", 
      to: "/profile", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      badge: 0 
    },
    { 
      name: "Logout", 
      to: "#", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      badge: 0,
      action: logout
    },
  ] : [
    { 
      name: "Login", 
      to: "/login", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      badge: 0 
    },
    { 
      name: "Register", 
      to: "/register", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      badge: 0 
    },
  ];

  const handleUserAction = (action) => {
    if (action) {
      action();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed w-full top-0 left-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Logo with Cross Design */}
          <Logo />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => window.scrollTo(0, 0)}
                className="relative text-gray-300 font-medium px-2 py-1 hover:text-white transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                  after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400
                  after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.name}
                {/* Only show cart badge if user is logged in */}
                {link.badge > 0 && user && (
                  <span className={`absolute -top-2 -right-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg ${cartAnimate ? 'animate-ping' : ''}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            
            {/* User Profile */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Button with Favorites Badge */}
                  <Link
                    to="/profile"
                    onClick={() => window.scrollTo(0, 0)}
                    className="relative flex items-center space-x-2 text-gray-300 font-medium px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img 
                        src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                        alt={user.username || user.name} 
                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                      />
                      {/* Favorites Badge */}
                      {favoritesCount > 0 && (
                        <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg ${favoritesAnimate ? 'animate-ping' : ''}`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="group-hover:text-blue-300 transition-colors">
                      Profile
                    </span>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      window.scrollTo(0, 0);
                    }}
                    className="flex items-center space-x-2 text-gray-300 font-medium px-3 py-1 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {userLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.to}
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-gray-300 font-medium px-2 py-1 hover:text-white transition-colors duration-300
                        after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                        after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400
                        after:transition-all after:duration-300 hover:after:w-full relative"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Icons with Badges */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Cart Badge - Only show if user is logged in */}
            <Link
              to="/cart"
              onClick={() => window.scrollTo(0, 0)}
              className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Only show cart badge if user is logged in */}
              {totalCartItems > 0 && user && (
                <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg ${cartAnimate ? 'animate-ping' : ''}`}>
                  {totalCartItems}
                </span>
              )}
            </Link>
            
            {/* Mobile User Profile with Favorites Badge */}
            {user ? (
              <Link
                to="/profile"
                onClick={() => window.scrollTo(0, 0)}
                className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <div className="relative">
                  <img 
                    src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                    alt={user.username || user.name} 
                    className="w-6 h-6 rounded-full border-2 border-blue-500"
                  />
                  {/* Mobile Favorites Badge */}
                  {favoritesCount > 0 && (
                    <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-lg ${favoritesAnimate ? 'animate-ping' : ''}`}>
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => window.scrollTo(0, 0)}
                className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
            {/* Hamburger Icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Link
            to={user ? "/profile" : "/"} // Updated to redirect to profile if user is logged in
            onClick={() => {
              setIsOpen(false);
              window.scrollTo(0, 0);
            }}
            className="flex items-center space-x-2"
          >
            <svg 
              width="30" 
              height="30" 
              viewBox="0 0 100 100" 
              className="text-blue-400"
            >
              <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
              <rect x="40" y="15" width="20" height="15" rx="3" fill="currentColor"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4"/>
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
              <rect x="40" y="70" width="20" height="15" rx="3" fill="currentColor"/>
              <rect x="75" y="48" width="6" height="4" rx="1" fill="currentColor"/>
              <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" strokeWidth="2.5"/>
              <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="3" fill="currentColor"/>
              <line x1="50" y1="50" x2="50" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{ transform: 'rotate(30deg)', transformOrigin: '50px 50px' }}/>
              <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: 'rotate(150deg)', transformOrigin: '50px 50px' }}/>
              <line x1="50" y1="25" x2="50" y2="30" stroke="currentColor" strokeWidth="2"/>
              <line x1="75" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="2"/>
              <line x1="50" y1="75" x2="50" y2="70" stroke="currentColor" strokeWidth="2"/>
              <line x1="25" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Luxe Watch
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                  alt={user.username || user.name} 
                  className="w-12 h-12 rounded-full border-2 border-blue-500"
                />
                {/* Favorites Badge in User Profile */}
                {favoritesCount > 0 && (
                  <span className={`absolute -top-1 -right-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg ${favoritesAnimate ? 'animate-ping' : ''}`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">{user.username || user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex flex-col p-4 gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => {
                setIsOpen(false);
                window.scrollTo(0, 0);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                link.badge > 0 && user
                  ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-md' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className={`p-3 rounded-xl ${
                link.badge > 0 && user
                  ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 shadow-inner' 
                  : 'bg-gray-700'
              } transition-colors`}>
                <div className={`${
                  link.name === 'Home' ? 'text-blue-400' :
                  link.name === 'Products' ? 'text-purple-400' :
                  link.name === 'Cart' ? 'text-cyan-400' :
                  'text-gray-300'
                }`}>
                  {link.icon}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className={`font-medium ${
                  link.badge > 0 && user ? 'text-white' : 'text-gray-300'
                } group-hover:text-white transition-colors`}>
                  {link.name}
                </span>
                {/* Only show cart badge if user is logged in */}
                {link.badge > 0 && user && (
                  <span className={`bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-md ${cartAnimate ? 'animate-ping' : ''}`}>
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          
          {/* User Links */}
          {userLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={(e) => {
                if (link.action) {
                  e.preventDefault();
                  handleUserAction(link.action);
                } else {
                  setIsOpen(false);
                  window.scrollTo(0, 0);
                }
              }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] bg-gray-800 hover:bg-gray-700`}
            >
              <div className={`p-3 rounded-xl bg-gray-700 transition-colors`}>
                <div className="text-gray-300">
                  {link.icon}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
                  {link.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Full Page Blur Overlay when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}