// src/components/Logo.jsx
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link 
      to="/" 
      onClick={() => window.scrollTo(0, 0)}
      className="flex items-center space-x-2 group"
    >
      {/* Minimalist Watch Icon */}
      <div className="relative">
        <svg 
          width="35" 
          height="35" 
          viewBox="0 0 85 85" 
          className="text-blue-400 group-hover:text-blue-200 transition-colors"
        >
          {/* Watch Band Top */}
          <rect x="40" y="15" width="20" height="15" rx="3" fill="currentColor"/>
          
          {/* Watch Case */}
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4"/>
          
          {/* Watch Band Bottom */}
          <rect x="40" y="70" width="20" height="15" rx="3" fill="currentColor"/>
          
          {/* Watch Crown */}
          <rect x="75" y="48" width="6" height="4" rx="1" fill="currentColor"/>
          
          {/* Center Point */}
          <circle cx="50" cy="50" r="3" fill="currentColor"/>
          
          {/* Hour Hand */}
          <line 
            x1="50" y1="50" 
            x2="50" y2="35" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round"
            style={{ transform: 'rotate(60deg)', transformOrigin: '50px 50px' }}
          />
          
          {/* Minute Hand */}
          <line 
            x1="50" y1="50" 
            x2="50" y2="30" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
            style={{ transform: 'rotate(300deg)', transformOrigin: '50px 50px' }}
          />
        </svg>
      </div>
      
      {/* Site Name */}
      <div>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition-all duration-300">
          Luxe Watches
        </span>
      </div>
    </Link>
  );
}