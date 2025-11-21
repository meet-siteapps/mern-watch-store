export default function BrandsAbout() {
  const brands = ["Rolex", "Omega", "Tag Heuer", "Breitling", "Patek Philippe"];

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      </div>

      {/* Animated Watch Visualization */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-white drop-shadow-[0_0_20px_rgba(0,191,255,0.7)]">
              About Our Store
            </h2>

            <p className="text-gray-300 mb-8 text-lg">
              Welcome to Luxury Watchhouse — your ultimate destination for premium
              timepieces. Explore our curated collection from the world's most
              prestigious watch brands.
            </p>

            {/* Brands Heading */}
            <h3 className="text-2xl font-semibold mb-6 text-white drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]">
              Our Brands
            </h3>

            {/* Brand Cards */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-6 py-4 rounded-2xl shadow-lg hover:shadow-blue-500/50
                    hover:scale-105 transition-all duration-300 text-white font-semibold text-lg
                    border border-gray-700 hover:border-blue-500"
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Animated Watch */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Watch Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Watch Band */}
                <div className="absolute w-64 h-64 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full border-4 border-gray-600 shadow-2xl z-10"></div>
                
                {/* Watch Face */}
                <div className="absolute w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-gray-600 shadow-2xl z-20 flex items-center justify-center">
                  {/* Watch Center */}
                  <div className="absolute w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full z-30 shadow-lg animate-pulse"></div>
                  
                  {/* Hour Marks */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30) * (Math.PI / 180);
                    const length = i % 3 === 0 ? 12 : 6;
                    const width = i % 3 === 0 ? 3 : 2;
                    const x1 = 70 * Math.sin(angle);
                    const y1 = -70 * Math.cos(angle);
                    
                    return (
                      <div
                        key={i}
                        className="absolute bg-gray-400"
                        style={{
                          transform: `translate(${x1}px, ${y1}px) rotate(${i * 30}deg)`,
                          width: `${width}px`,
                          height: `${length}px`,
                          transformOrigin: 'center center'
                        }}
                      ></div>
                    );
                  })}
                  
                  {/* Hour Hand */}
                  <div 
                    className="absolute w-1 h-16 bg-gradient-to-t from-gray-300 to-gray-100 rounded-full origin-bottom z-30"
                    style={{ transform: 'translateY(-50%) rotate(30deg)' }}
                  ></div>
                  
                  {/* Minute Hand */}
                  <div 
                    className="absolute w-0.5 h-20 bg-gradient-to-t from-gray-300 to-gray-100 rounded-full origin-bottom z-30"
                    style={{ transform: 'translateY(-50%) rotate(180deg)' }}
                  ></div>
                  
                  {/* Second Hand */}
                  <div 
                    className="absolute w-0.5 h-24 bg-gradient-to-t from-red-500 to-red-400 rounded-full origin-bottom z-30 animate-tick"
                    style={{ transform: 'translateY(-50%)' }}
                  ></div>
                </div>
                
                {/* Watch Crown */}
                <div className="absolute right-0 top-1/2 w-8 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-lg border-l border-t border-b border-gray-500 z-20"></div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-xl animate-pulse-slow z-0"></div>
              </div>
              
              {/* Floating Particles */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-400 opacity-20"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles - Fixed the jsx attribute issue */}
      <style>{`
        @keyframes tick {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        .animate-tick {
          animation: tick 12s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}