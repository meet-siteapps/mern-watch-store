import { Link } from "react-router-dom";

export default function BrandsAbout() {
  const brands = [
    { name: "Rolex", color: "from-green-600 to-emerald-500" },
    { name: "Omega", color: "from-red-600 to-orange-500" },
    { name: "Tag Heuer", color: "from-green-600 to-lime-500" },
    { name: "Breitling", color: "from-yellow-600 to-amber-500" },
    { name: "Patek Philippe", color: "from-blue-600 to-indigo-500" },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px]"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-10 animate-float-reverse"></div>
      </div>

      {/* Animated Watch Visualization */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            {/* Section Badge */}
            <div className="inline-block px-4 py-1 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm font-semibold text-white shadow-lg">
              LUXURY COLLECTION
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-[0_0_20px_rgba(0,191,255,0.7)]">
              About Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Store
              </span>
            </h2>

            <p className="text-gray-300 mb-10 text-lg leading-relaxed">
              Welcome to Luxury Watchhouse — your ultimate destination for
              premium timepieces. Explore our curated collection from the
              world's most prestigious watch brands, each representing a legacy
              of craftsmanship and precision.
            </p>

            {/* Brands Heading */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <h3 className="text-2xl font-semibold text-white drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]">
                Our Brands
              </h3>
              <div className="ml-4 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            </div>

            {/* Brand Cards */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {brands.map((brand, index) => (
                <div
                  key={index}
                  className={`group relative px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 text-white font-semibold text-lg border border-gray-700 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:shadow-xl animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${brand.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>

                  {/* Brand name with icon */}
                  <div className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors"
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
                    {brand.name}
                  </div>

                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                </div>
              ))}
            </div>

            {/* CTA Button - Now using Link component */}
            <div className="mt-10">
              <Link
                to="/products"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_6px_rgba(59,130,246,0.8)] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95 active:shadow-inner flex items-center gap-2 mx-auto lg:mx-0 text-sm sm:text-base transform origin-center"
              >
                Explore Collection
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
          </div>

          {/* Right - Animated Watch */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Watch Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute w-72 h-72 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full border-4 border-gray-600 shadow-2xl z-0 animate-pulse-slow"></div>

                {/* Watch Band */}
                <div className="absolute w-64 h-64 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full border-4 border-gray-600 shadow-2xl z-10"></div>

                {/* Watch Face */}
                <div className="absolute w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-gray-600 shadow-2xl z-20 flex items-center justify-center">
                  {/* Inner Circle */}
                  <div className="absolute w-40 h-40 rounded-full border border-gray-600"></div>

                  {/* Watch Center */}
                  <div className="absolute w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full z-30 shadow-lg animate-pulse"></div>

                  {/* Brand Logo */}
                  <div className="absolute top-6 text-xs font-bold text-gray-400 tracking-widest">
                    LUXURY
                  </div>

                  {/* Hour Marks */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = i * 30 * (Math.PI / 180);
                    const length = i % 3 === 0 ? 12 : 6;
                    const width = i % 3 === 0 ? 3 : 2;
                    const x1 = 70 * Math.sin(angle);
                    const y1 = -70 * Math.cos(angle);

                    return (
                      <div
                        key={i}
                        className="absolute bg-gray-400"
                        style={{
                          transform: `translate(${x1}px, ${y1}px) rotate(${
                            i * 30
                          }deg)`,
                          width: `${width}px`,
                          height: `${length}px`,
                          transformOrigin: "center center",
                        }}
                      ></div>
                    );
                  })}

                  {/* Numbers */}
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
                    const angle = i * 30 * (Math.PI / 180);
                    const radius = 55;
                    const x = radius * Math.sin(angle);
                    const y = -radius * Math.cos(angle);

                    return (
                      <div
                        key={i}
                        className="absolute text-xs font-bold text-gray-300"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                          width: "10px",
                          height: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {num}
                      </div>
                    );
                  })}

                  {/* Hour Hand */}
                  <div
                    className="absolute w-1.5 h-16 bg-gradient-to-t from-gray-200 to-gray-100 rounded-full origin-bottom z-30"
                    style={{ transform: "translateY(-50%) rotate(30deg)" }}
                  ></div>

                  {/* Minute Hand */}
                  <div
                    className="absolute w-1 h-20 bg-gradient-to-t from-gray-300 to-gray-100 rounded-full origin-bottom z-30"
                    style={{ transform: "translateY(-50%) rotate(180deg)" }}
                  ></div>

                  {/* Second Hand */}
                  <div
                    className="absolute w-0.5 h-24 bg-gradient-to-t from-red-500 to-red-400 rounded-full origin-bottom z-30 animate-tick"
                    style={{ transform: "translateY(-50%)" }}
                  ></div>

                  {/* Date Window */}
                  <div className="absolute bottom-10 right-8 w-8 h-6 bg-gray-700 rounded-sm border border-gray-600 flex items-center justify-center text-xs">
                    25
                  </div>
                </div>

                {/* Watch Crown */}
                <div className="absolute right-0 top-1/2 w-8 h-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-l-lg border-l border-t border-b border-gray-500 z-20"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-xl animate-pulse-slow z-0"></div>

                {/* Watch Details */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 bg-black/50 px-3 py-1 rounded-full">
                  Swiss Movement • Water Resistant
                </div>
              </div>

              {/* Floating Particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-blue-400 opacity-20"
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${
                      Math.random() * 6 + 4
                    }s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                ></div>
              ))}

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 border-blue-500/30 animate-ping"></div>
              <div
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full border-2 border-cyan-500/30 animate-ping"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes tick {
          0% {
            transform: translateY(-50%) rotate(0deg);
          }
          100% {
            transform: translateY(-50%) rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(10px) translateX(-5px);
          }
          50% {
            transform: translateY(0) translateX(-10px);
          }
          75% {
            transform: translateY(-10px) translateX(-5px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-tick {
          animation: tick 12s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
