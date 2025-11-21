// src/pages/admin/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";

export default function AdminProfile() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [loadingUserData, setLoadingUserData] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // Fetch complete user data if createdAt is missing
  useEffect(() => {
    const fetchCompleteUserData = async () => {
      if (user && !user.createdAt) {
        setLoadingUserData(true);
        try {
          const token = localStorage.getItem('token');
          const response = await api.get('/users/get-user-information', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data) {
            updateUser(response.data);
          }
        } catch (error) {
          console.error('Error fetching complete user data:', error);
        } finally {
          setLoadingUserData(false);
        }
      }
    };

    fetchCompleteUserData();
  }, [user, updateUser]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    // All inputs are read-only, so this function is now disabled
    return;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    updateUser(null); // Clear user context
    navigate('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
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

  if (loadingUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading profile data...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
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
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Admin Profile</h1>
          <p className="text-gray-400">View your account information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={formData.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Admin
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
                <div className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176 1.332 9-5.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Account active
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">Profile Information</h3>
                <p className="text-gray-400 text-sm mt-1">Your profile information is set to read-only mode</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    disabled={true}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white cursor-not-allowed opacity-75"
                  />
                </div>

                <button
                  disabled={true}
                  className="w-full py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
                >
                  Password Change Disabled
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 bg-red-900/50 text-white rounded-lg hover:bg-red-800/50 transition flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
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