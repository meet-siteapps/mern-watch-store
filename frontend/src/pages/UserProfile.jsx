import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { useFavorites } from '../context/FavoritesContext';
import { useUser } from '../context/UserContext';

const EnhancedProfile = () => {
  const { user, loading: userLoading, fetchUserInfo } = useUser();
  const { favorites, removeFromFavorites, loading: favoritesLoading } = useFavorites() || { favorites: [], loading: true };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { logout } = useUser();
  const [activeTab, setActiveTab] = useState(() => {
    // Remember last active tab using localStorage
    return localStorage.getItem('activeProfileTab') || 'dashboard';
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersFetched, setOrdersFetched] = useState(false);

  // Helper function to get the order number/ID from different possible fields
  const getOrderNumber = useCallback((order) => {
    if (!order) return 'N/A';
    
    // Check all possible fields where order number might be stored
    const possibleFields = ['orderNumber', 'orderId', 'order_id', '_id', 'id'];
    
    for (const field of possibleFields) {
      if (order[field]) {
        return order[field];
      }
    }
    
    // If none of the standard fields exist, check if there's a custom field
    if (order.customOrderId) return order.customOrderId;
    
    // Last resort - use the index or timestamp
    return `ORD-${Date.now()}`;
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('activeProfileTab', activeTab);
  }, [activeTab]);

  // Fetch user orders - optimized to only fetch when needed
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/orders/get-order-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      
      if (data.status === "success") {
        setOrders(data.data);
        setOrdersFetched(true);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  // Fetch orders when user changes or when explicitly refreshing
  useEffect(() => {
    if (user && !ordersFetched) {
      fetchUserOrders();
    }
  }, [user, ordersFetched, fetchUserOrders]);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        await fetchUserInfo();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [fetchUserInfo]);

  const handleLogout = () => {
    logout();
    navigate('/');
    window.scrollTo(0, 0);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-900 text-gray-300';
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-900 text-green-300';
      case 'processing':
        return 'bg-yellow-900 text-yellow-300';
      case 'shipped':
        return 'bg-blue-900 text-blue-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    if (activeTab === 'dashboard') {
      return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          
          {/* Mini Favorites Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Recent Favorites</h3>
              <button 
                onClick={() => setActiveTab('favorites')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All
              </button>
            </div>
            {loading || userLoading || favoritesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <SkeletonLoader type="product" count={3} />
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {favorites.slice(0, 3).map((product) => (
                  <div key={product._id} className="bg-gray-700 rounded-lg p-3 flex items-center">
                    <img 
                      src={product.url || "https://via.placeholder.com/150"} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </div>
                    <span className="font-bold text-blue-400 text-sm">${product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-3 text-sm">No favorites yet</p>
            )}
          </div>
          
          {/* Mini Orders Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Recent Orders</h3>
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                View All
              </button>
            </div>
            {ordersLoading ? (
              <SkeletonLoader type="text" count={2} />
            ) : orders.length > 0 ? (
              <div className="space-y-2">
                {orders.slice(0, 2).map((order) => (
                  <div key={order._id} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Order #{getOrderNumber(order)}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-3 text-sm">No orders yet</p>
            )}
          </div>
        </div>
      );
    }
    
    if (activeTab === 'profile') {
      return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          
          {loading || userLoading ? (
            <div className="space-y-3">
              <SkeletonLoader type="text" count={2} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                  <div className="p-2 bg-gray-700 rounded-lg text-sm">{user.username || user.name}</div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 text-sm">Email Address</label>
                  <div className="p-2 bg-gray-700 rounded-lg text-sm">{user.email}</div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-700">
                <h3 className="text-md font-medium mb-3">Account Security</h3>
                <div className="space-y-2">
                  <button className="w-full p-2 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition flex items-center justify-between text-sm">
                    <span>Change Password</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (activeTab === 'favorites') {
      return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Favorites</h2>
            <span className="text-gray-400">{favorites.length} items</span>
          </div>
          
          {loading || userLoading || favoritesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonLoader type="product" count={3} />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No favorites yet</h3>
              <p className="text-gray-400 mb-4 text-sm">You haven't added any items to your favorites.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg shadow hover:scale-105 transition-all duration-300 text-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((product) => (
                <div key={product._id} className="bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative">
                    <img 
                      src={product.url || "https://via.placeholder.com/150"} 
                      alt={product.name} 
                      className="w-full h-36 object-cover"
                    />
                    <button 
                      onClick={() => removeFromFavorites(product._id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-white mb-1 text-sm">{product.name}</h4>
                    <p className="text-gray-400 text-xs mb-2">{product.brand}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-blue-400">${product.price.toLocaleString()}</span>
                      <button 
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    if (activeTab === 'orders') {
      return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Order History</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchUserOrders}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                disabled={ordersLoading}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <span className="text-gray-400">{orders.length} orders</span>
            </div>
          </div>
          
          {ordersLoading ? (
            <div className="space-y-3">
              <SkeletonLoader type="product" count={3} />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
              <p className="text-gray-400 mb-4 text-sm">You haven't placed any orders yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg shadow hover:scale-105 transition-all duration-300 text-sm"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="p-3 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-sm">Order #{getOrderNumber(order)}</h4>
                      <p className="text-xs text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-400 text-xs">
                      {Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + (item.quantity || 0), 0) : 0} items
                    </span>
                    <span className="font-medium text-sm">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  }, [activeTab, loading, userLoading, favoritesLoading, favorites, orders, ordersLoading, user, removeFromFavorites, navigate, fetchUserOrders, getOrderNumber]);

  // Show login prompt if user is not logged in and not loading
  if (!user && !loading && !userLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400 drop-shadow-lg mb-8">Profile</h1>
          <div className="py-12">
            <p className="text-4xl font-bold mb-4 animate-pulse">You need to be logged in to view your 📲 profile.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-white text-black font-bold rounded-lg 
             shadow-[0_0_15px_rgba(255,255,255,0.8)]
             hover:shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(255,255,255,0.8)]
             hover:scale-105 
             transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
            <SkeletonLoader type="text" count={5} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-24">
              {/* Profile Summary */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <img 
                    src={user.avatar || "https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"} 
                    alt={user.username || user.name} 
                    className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <h2 className="text-xl font-bold">{user.username || user.name}</h2>
                <p className="text-blue-300 text-sm">{user.email}</p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-400">{orders.length}</p>
                  <p className="text-xs text-gray-400">Orders</p>
                </div>
                <div className="bg-gray-700 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-pink-400">{favorites.length}</p>
                  <p className="text-xs text-gray-400">Favorites</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'dashboard' ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'profile' ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Info
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'favorites' ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favorites
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center ${activeTab === 'orders' ? 'bg-blue-900 text-blue-300' : 'hover:bg-gray-700'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </button>
              </nav>
              
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="w-full mt-8 px-4 py-3 bg-red-900 hover:bg-red-800 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-pulse"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {tabContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProfile;