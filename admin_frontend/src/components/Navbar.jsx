// src/components/Navbar.jsx
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const { user, logout } = useUser();
  
  // Admin menu items with icons
  const links = [
    { 
      name: "Dashboard", 
      to: "/admin/dashboard", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: "Products", 
      to: "/admin/products", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      name: "Orders", 
      to: "/admin/orders", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      name: "Users", 
      to: "/admin/users", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
  ];

  // Simplified settings menu items with icons
  const settingsLinks = [
    { 
      name: "Admin Profile", 
      to: "/admin/settings/profile", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: "Site Configuration", 
      to: "/admin/site-config", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  // User menu items
  const userLinks = user ? [
    { 
      name: "Logout", 
      to: "#", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      action: logout
    },
  ] : [
    { 
      name: "Login", 
      to: "/admin/login", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
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
              </Link>
            ))}
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="relative text-gray-300 font-medium px-2 py-1 hover:text-white transition-colors duration-300
                  after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px]
                  after:bg-gradient-to-r after:from-blue-400 after:to-cyan-400
                  after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
                <svg className={`w-4 h-4 transition-transform duration-300 ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Settings</h3>
                    <p className="text-sm text-gray-400">Manage admin preferences</p>
                  </div>
                  <div className="py-2">
                    {settingsLinks.map((setting) => (
                      <Link
                        key={setting.name}
                        to={setting.to}
                        onClick={() => {
                          setIsSettingsOpen(false);
                          window.scrollTo(0, 0);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-gray-700 text-blue-400">
                          {setting.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{setting.name}</h4>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Profile Button */}
                  <Link
                    to="/admin/settings/profile"
                    onClick={() => window.scrollTo(0, 0)}
                    className="relative flex items-center space-x-2 text-gray-300 font-medium px-3 py-1 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img 
                        src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                        alt={user.username || user.name} 
                        className="w-8 h-8 rounded-full border-2 border-blue-500"
                      />
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

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile User Profile */}
            {user ? (
              <Link
                to="/admin/settings/profile"
                onClick={() => window.scrollTo(0, 0)}
                className="relative p-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <div className="relative">
                  <img 
                    src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                    alt={user.username || user.name} 
                    className="w-6 h-6 rounded-full border-2 border-blue-500"
                  />
                </div>
              </Link>
            ) : (
              <Link
                to="/admin/login"
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
        className={`fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <Link
            to={user ? "/admin/dashboard" : "/admin/login"}
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
              Admin Panel
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

        {/* Scrollable Content Area */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
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
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] bg-gray-800 hover:bg-gray-700`}
              >
                <div className={`p-3 rounded-xl bg-gray-700 transition-colors`}>
                  <div className={`${
                    link.name === 'Dashboard' ? 'text-blue-400' :
                    link.name === 'Products' ? 'text-purple-400' :
                    link.name === 'Orders' ? 'text-cyan-400' :
                    'text-green-400'
                  }`}>
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
            
            {/* Settings Section */}
            <div className="mt-2">
              <button
                onClick={() => setIsMobileSettingsOpen(!isMobileSettingsOpen)}
                className="flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 bg-gray-800 hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gray-700">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-300">Settings</span>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMobileSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isMobileSettingsOpen && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-700 pl-4">
                  {settingsLinks.map((setting) => (
                    <Link
                      key={setting.name}
                      to={setting.to}
                      onClick={() => {
                        setIsOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-gray-700">
                        {setting.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{setting.name}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
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