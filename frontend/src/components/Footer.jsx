import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

const Footer = () => {
  const favoritesContext = useFavorites() || { favorites: [] };
  const { favorites } = favoritesContext;
  const { cartItems } = useContext(CartContext) || { cartItems: [] };
  
  const currentYear = new Date().getFullYear();
  
  // Project team members
  const teamMembers = [
    { name: 'Jenil Dhankra', role: 'Frontend Developer' },
    { name: 'Meet Savaliya', role: 'Backend Developer' },
    { name: 'Harsh Vaviya', role: 'Project Lead' }
  ];
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Contact form submitted:", formData);
      
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-5 animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-500 rounded-full filter blur-3xl opacity-5 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:40px_40px]"></div>
      </div>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-300 animate-bounce"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 inline-block">
                Luxe Watch
              </Link>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Discover our exclusive collection of luxury timepieces. Each watch is a masterpiece of craftsmanship and precision.
            </p>
            
            {/* Quick Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-800/50 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 011.21.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V7a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300">+91 70460 90450</p>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-800/50 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300">info@luxewatches.com</p>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-800/50 transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300">123 Luxury Street, Surat, Gujarat</p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="group w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-900/50 hover:border-blue-500 transition-all duration-300">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="group w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-900/50 hover:border-pink-500 transition-all duration-300">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153c.486.486.835 1.078 1.07 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.486.486-1.078.835-1.772 1.07-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153c-.486-.486-1.078.835-1.772-1.07-.636-.247-1.363.416-2.427.465 1.024-.047 1.379-.06 3.808-.06h.63zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.5-7.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="group w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-900/50 hover:border-blue-500 transition-all duration-300">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/profile" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="group flex items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Cart ({totalCartItems})
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Customer Service
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="group flex items-center text-gray-400 hover:text-white transition-colors text-left w-full"
                >
                  <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <h3 className="text-lg font-semibold text-white mb-4 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"></span>
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get special offers and updates
            </p>
            <form className="flex mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 w-full rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-3 rounded-r-lg hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </form>

            {/* Contact Form (Toggleable) */}
            {showContactForm && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 animate-fade-in-up">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send us a message
                </h4>
                
                {submitSuccess && (
                  <div className="mb-3 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 text-sm flex items-center animate-fade-in">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Thank you! We'll get back to you soon.
                  </div>
                )}
                
                {submitError && (
                  <div className="mb-3 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm flex items-center animate-fade-in">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleContactChange}
                    placeholder="Your Name"
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleContactChange}
                    placeholder="Your Email"
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleContactChange}
                    placeholder="Your Message"
                    className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    rows={3}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Lux Watches. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors group">
                Privacy Policy
                <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors group">
                Terms of Service
                <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors group">
                Cookie Policy
                <span className="block h-0.5 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
          
          {/* Project Team Section */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                Developed by:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700 group hover:border-blue-500/30 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 group-hover:animate-pulse"></div>
                    <span className="text-gray-300 text-sm">{member.name}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-blue-400 text-xs">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;