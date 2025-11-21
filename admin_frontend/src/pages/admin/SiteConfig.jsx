// src/pages/admin/SiteConfig.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function SiteConfig() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('general');
  
  const [config] = useState({
    // General Settings
    siteName: 'My Website',
    siteDescription: 'A showcase website built with React and Node.js',
    adminEmail: 'admin@example.com',
    
    // Payment Settings
    currency: 'USD',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmationEmail: true,
    shippingUpdateEmail: true,
    promotionalEmails: false
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access admin panel</h1>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:scale-105 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-12">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className={`relative rounded-xl shadow-xl overflow-hidden ${
            notification.type === 'error'
              ? 'bg-gradient-to-r from-red-600 to-red-500'
              : 'bg-gradient-to-r from-green-600 to-green-500'
          }`}>
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4 flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black bg-opacity-20 mr-3">
                {notification.type === 'error' ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{notification.message}</p>
              </div>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: '' })}
                className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Site Configuration</h1>
          <p className="text-gray-400">View your website settings and preferences</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {[
              { id: 'general', label: 'General' },
              { id: 'payment', label: 'Payment' },
              { id: 'notifications', label: 'Notifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
                
                <div>
                  <label className="block text-gray-300 mb-2">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    value={config.siteName}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Site Description</label>
                  <textarea
                    name="siteDescription"
                    value={config.siteDescription}
                    disabled={true}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Admin Email</label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={config.adminEmail}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-white">Cash on Delivery</span>
                    </div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-white">Card Payment</span>
                    </div>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg opacity-60">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                      <span className="text-white">PayPal</span>
                    </div>
                    <span className="text-yellow-400 text-sm">Under Construction</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg opacity-60">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                      <span className="text-white">Bank Transfer</span>
                    </div>
                    <span className="text-yellow-400 text-sm">Under Construction</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-white">Currency</span>
                      <span className="text-gray-400">{config.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Email Notifications</span>
                    <span className={config.emailNotifications ? "text-green-400" : "text-red-400"}>
                      {config.emailNotifications ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">SMS Notifications</span>
                    <span className={config.smsNotifications ? "text-green-400" : "text-red-400"}>
                      {config.smsNotifications ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Order Confirmation Emails</span>
                    <span className={config.orderConfirmationEmail ? "text-green-400" : "text-red-400"}>
                      {config.orderConfirmationEmail ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Shipping Update Emails</span>
                    <span className={config.shippingUpdateEmail ? "text-green-400" : "text-red-400"}>
                      {config.shippingUpdateEmail ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-white">Promotional Emails</span>
                    <span className={config.promotionalEmails ? "text-green-400" : "text-red-400"}>
                      {config.promotionalEmails ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-700 space-x-3">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}