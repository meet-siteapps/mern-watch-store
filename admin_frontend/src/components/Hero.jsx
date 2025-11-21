import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Admin Panel Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0wIDBoNDB2NDBIMHoiIG9wYWNpdHk9Ii4wNSIvPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      </div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      
      {/* Interactive Mouse-Following Light */}
      <div 
        className="absolute w-64 h-64 bg-blue-400 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${mousePosition.x - 128}px`,
          top: `${mousePosition.y - 128}px`,
        }}
      ></div>
      
      {/* Admin-themed Floating Elements */}
      <div className="absolute top-20 right-10 animate-float-slow">
        <div className="w-16 h-16 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-full border border-blue-500/30">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-10 animate-float-slow" style={{ animationDelay: '1s' }}>
        <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-lg border border-purple-500/30">
          <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
      
      {/* Simple Admin Icons */}
      <div className="absolute top-1/3 left-10 w-16 h-16 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-lg border border-blue-400/20">
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <div className="absolute bottom-1/3 right-10 w-14 h-14 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm rounded-full border border-purple-400/20">
        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl px-6 pt-16">
        {/* Admin Panel Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 backdrop-blur-sm rounded-full mb-6 border border-blue-700/50">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          <span className="text-blue-300 font-medium text-sm">ADMIN PANEL</span>
        </div>
        
        {/* Heading with glow + animated underline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg relative inline-block group">
          <span className="relative z-10">Admin Control Center</span>
          {/* Soft blue halo glow */}
          <span className="absolute inset-0 blur-lg text-blue-400 opacity-30 select-none">
            Admin Control Center
          </span>
          {/* Underline */}
          <span className="block h-[3px] bg-gradient-to-r from-blue-400 to-blue-600 absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-0 animate-underline group-hover:w-full"></span>
        </h1>

        <p className="text-xl text-gray-300 drop-shadow-md mt-10 max-w-2xl mx-auto">
          Manage your store, track orders, analyze performance, and configure settings—all from one powerful dashboard.
        </p>

        {/* Admin Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            to="/admin/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(59,130,246,0.8)] hover:from-blue-500 hover:to-blue-700 animate-glow-blue group"
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
          
          <Link
            to="/admin/site-config"
            className="inline-block px-8 py-4 bg-gray-800/70 backdrop-blur-sm text-white font-bold rounded-lg shadow-lg border border-gray-700 relative overflow-hidden transition-all duration-300 hover:bg-gray-700/70 hover:border-blue-500/50 hover:shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] group"
          >
            <span className="relative z-10 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure Settings
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>
      </div>
      
      {/* Animated Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" 
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
      
      {/* Style definitions for new animations */}
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          .animate-float-slow {
            animation: float-slow 4s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
}