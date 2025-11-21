// src/components/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Admin team members
  const teamMembers = [
    { name: 'Jenil Dhankra', role: 'Frontend Developer' },
    { name: 'Meet Savaliya', role: 'Backend Developer' },
    { name: 'Harsh Vaviya', role: 'Project Lead' }
  ];
  
  // Support form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showSupportForm, setShowSupportForm] = useState(false);

  const handleSupportChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Support form submitted:", formData);
      
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.");
      console.error("Support form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/admin/dashboard" className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 inline-block">
              Lux Watches Admin
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Comprehensive admin panel for managing your luxury watch store. Monitor sales, manage inventory, and configure settings.
            </p>
            
            {/* Quick Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13 2.257a1 1 0 011.21.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V7a2 2 0 012-2z" />
                </svg>
                +91 70460 90450
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                admin@timelessluxury.com
              </div>
              <div className="flex items-center text-gray-300">
                <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123 Admin Street, Surat, Gujarat
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-900/50 hover:border-blue-500 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-900/50 hover:border-pink-500 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153c.486.486.835 1.078 1.07 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.486.486-1.078.835-1.772 1.07-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153c-.486-.486-.835-1.078-1.07-1.772-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772c.486-.486 1.078.835-1.772 1.07.636-.247 1.363-.416-2.427-.465 1.024-.047 1.379-.06 3.808-.06h.63zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.5-7.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-900/50 hover:border-blue-500 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-900/50 hover:border-purple-500 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Admin Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Admin Panel</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="text-gray-400 hover:text-white transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="text-gray-400 hover:text-white transition-colors">
                  Users
                </Link>
              </li>
              <li>
                <Link to="/admin/inquiries" className="text-gray-400 hover:text-white transition-colors">
                  Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/settings/profile" className="text-gray-400 hover:text-white transition-colors">
                  Admin Profile
                </Link>
              </li>
              <li>
                <Link to="/admin/settings/account" className="text-gray-400 hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/settings/site" className="text-gray-400 hover:text-white transition-colors">
                  Site Configuration
                </Link>
              </li>
              <li>
                <Link to="/admin/settings/payment" className="text-gray-400 hover:text-white transition-colors">
                  Payment Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Admin Support</h3>
            <p className="text-gray-400 mb-4">
              Need help with the admin panel? Contact our technical support team.
            </p>
            
            {/* Documentation */}
            <div className="mb-6">
              <Link to="/admin/docs" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documentation
              </Link>
            </div>
            
            {/* Support Form (Toggleable) */}
            <button 
              onClick={() => setShowSupportForm(!showSupportForm)}
              className="w-full text-left px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors mb-4"
            >
              {showSupportForm ? "Hide Support Form" : "Contact Support"}
            </button>
            
            {showSupportForm && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-medium mb-3">Technical Support</h4>
                
                {submitSuccess && (
                  <div className="mb-3 p-2 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
                    Thank you! Our support team will get back to you soon.
                  </div>
                )}
                
                {submitError && (
                  <div className="mb-3 p-2 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSupportSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleSupportChange}
                    placeholder="Your Name"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleSupportChange}
                    placeholder="Your Email"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleSupportChange}
                    placeholder="Describe your issue"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
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
              &copy; {currentYear} Lux Watches Admin Panel. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/admin/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/admin/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/admin/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Development Team Section */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-2 md:mb-0">
                Admin Panel Developed by:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center bg-gray-800 rounded-full px-3 py-1">
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
    </footer>
  );
};

export default Footer;