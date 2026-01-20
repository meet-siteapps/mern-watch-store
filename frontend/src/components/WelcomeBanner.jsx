// src/components/WelcomeBanner.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WelcomeBanner({ user, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [activeOffer, setActiveOffer] = useState(0);

  useEffect(() => {
    // Auto-rotate offers every 3 seconds
    const offerTimer = setInterval(() => {
      setActiveOffer(prev => (prev + 1) % 4);
    }, 3000);

    // Progress bar timer
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          setIsVisible(false);
          setTimeout(onClose, 300);
          return 0;
        }
        return prev - 2; // Decrease by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => {
      clearInterval(offerTimer);
      clearInterval(progressTimer);
    };
  }, [onClose]);

  if (!isVisible) return null;

  const offers = [
    {
      title: "Summer Spectacular",
      description: "30% off on all luxury watches",
      icon: "🔥",
      color: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/50",
      hover: "hover:border-yellow-400",
      timeLeft: "Ends in 3 days"
    },
    {
      title: "New Arrivals",
      description: "Exclusive collection just launched",
      icon: "✨",
      color: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/50",
      hover: "hover:border-purple-400",
      timeLeft: "Limited stock"
    },
    {
      title: "Free Shipping",
      description: "On orders over $500",
      icon: "🚚",
      color: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50",
      hover: "hover:border-green-400",
      timeLeft: "Limited time"
    },
    {
      title: "Member Exclusive",
      description: "20% off for loyal customers",
      icon: "💎",
      color: "from-blue-500/20 to-indigo-500/20",
      border: "border-blue-500/50",
      hover: "hover:border-blue-400",
      timeLeft: "Members only"
    }
  ];

  const collections = [
    { name: "Luxury", icon: "⌚", gradient: "from-blue-600 to-indigo-600" },
    { name: "Sports", icon: "🏃", gradient: "from-green-600 to-teal-600" },
    { name: "Classic", icon: "🎩", gradient: "from-amber-600 to-orange-600" },
    { name: "Smart", icon: "📱", gradient: "from-purple-600 to-pink-600" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg animate-fadeIn"></div>
      
      {/* Banner Container */}
      <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp">
        {/* Progress bar at top */}
        <div className="h-1 w-full bg-gray-700/50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-300 z-10 group"
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Banner Content */}
        <div className="p-8">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 animate-pulse shadow-lg shadow-blue-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username || 'Watch Enthusiast'}!</h2>
            <p className="text-gray-300">Discover our latest collections and exclusive offers</p>
          </div>
          
          {/* Featured Offers */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Special Offers Just For You</h3>
            <div className="relative h-40 overflow-hidden rounded-xl">
              {offers.map((offer, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 bg-gradient-to-r ${offer.color} rounded-xl p-5 border ${offer.border} ${offer.hover} transition-all duration-500 ${index === activeOffer ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="flex items-start h-full">
                    <div className="flex-shrink-0 text-4xl mr-4">{offer.icon}</div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{offer.title}</h3>
                      <p className="text-gray-200 text-lg">{offer.description}</p>
                      <div className="mt-2 text-sm text-white/80 flex items-center">
                        <span>{offer.timeLeft}</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Offer Indicators */}
            <div className="flex justify-center mt-3 space-x-2">
              {offers.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveOffer(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeOffer ? 'bg-blue-500 w-6' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Featured Collections */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Featured Collections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {collections.map((collection, index) => (
                <div 
                  key={index} 
                  className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 border border-gray-600/30 hover:border-gray-500/50"
                >
                  <div className={`w-12 h-12 mx-auto bg-gradient-to-r ${collection.gradient} rounded-full flex items-center justify-center mb-2 shadow-md`}>
                    <span className="text-white text-xl">{collection.icon}</span>
                  </div>
                  <span className="text-white text-sm font-medium">{collection.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Link
              to="/products"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/30 group"
            >
              Explore Collection
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}