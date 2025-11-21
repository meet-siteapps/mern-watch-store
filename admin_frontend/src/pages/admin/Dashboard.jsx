// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function AdminDashboard() {
  const { user, getToken } = useUser();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        console.log("Fetching dashboard data with token");
        
        // Fetch products count
        const productsResponse = await api.get('/watches/get-all-products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const products = productsResponse.data.data || productsResponse.data;
        console.log("Products data:", products);
        
        // Fetch orders count and recent orders
        const ordersResponse = await api.get('/orders/get-all-orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const orders = ordersResponse.data.data || ordersResponse.data;
        console.log("Orders data:", orders);
        
        // Fetch users count
        const usersResponse = await api.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const users = usersResponse.data;
        console.log("Users data:", users);
        
        // Calculate top products (by order frequency)
        const productCount = {};
        orders.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              const productId = item.product?._id || item.productId;
              if (productCount[productId]) {
                productCount[productId]++;
              } else {
                productCount[productId] = 1;
              }
            });
          }
        });
        
        const sortedProducts = Object.entries(productCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([productId]) => {
            const product = products.find(p => p._id === productId);
            return product || { name: "Unknown Product", _id: productId };
          });
        
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          recentOrders: orders.slice(0, 5),
          topProducts: sortedProducts
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        
        // Handle 401 Unauthorized error specifically
        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          setError("Network error: Unable to connect to the server.");
        } else {
          setError(`Error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "text-green-500";
      case "Processing": return "text-blue-500";
      case "Shipped": return "text-purple-500";
      case "Cancelled": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  // Helper function to get the order number from different possible fields
  const getOrderNumber = (order) => {
    if (!order) return 'N/A';
    
    // Check all possible fields where order number might be stored
    const possibleFields = ['orderNumber', 'orderId', 'order_id', '_id', 'id'];
    
    for (const field of possibleFields) {
      if (order[field]) {
        // If it's the _id, we want to show the last 8 characters as before
        if (field === '_id') {
          return order[field].substring(order[field].length - 8);
        }
        return order[field];
      }
    }
    
    // If none of the standard fields exist, check if there's a custom field
    if (order.customOrderId) return order.customOrderId;
    
    // Last resort - use the index or timestamp
    return `ORD-${Date.now()}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access admin panel</h1>
          <Link
            to="/admin/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:scale-105 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome to your admin control panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-900/30 mr-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400">Total Products</p>
                {loading ? <SkeletonLoader type="text" /> : <p className="text-2xl font-bold">{stats.totalProducts}</p>}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-900/30 mr-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400">Total Orders</p>
                {loading ? <SkeletonLoader type="text" /> : <p className="text-2xl font-bold">{stats.totalOrders}</p>}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-900/30 mr-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400">Total Users</p>
                {loading ? <SkeletonLoader type="text" /> : <p className="text-2xl font-bold">{stats.totalUsers}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link to="/admin/orders" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
            </div>
            
            {loading ? (
              <SkeletonLoader type="list" count={5} />
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map(order => (
                    <div key={order._id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{getOrderNumber(order)}</p>
                        <p className="text-sm text-gray-400">{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalPrice || order.totalAmount || '0.00'}</p>
                        <p className={`text-sm ${getStatusColor(order.status)}`}>{order.status || 'Unknown'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent orders</p>
                )}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Top Products</h2>
              <Link to="/admin/products" className="text-blue-400 hover:text-blue-300 text-sm">View All</Link>
            </div>
            
            {loading ? (
              <SkeletonLoader type="list" count={5} />
            ) : (
              <div className="space-y-4">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-900/30 rounded-lg mr-3">
                        <span className="text-blue-400 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-gray-400">{product.brand}</p>
                      </div>
                      <p className="font-medium">${product.price || '0.00'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No products data available</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin/products" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-medium">Manage Products</span>
          </Link>
          
          <Link to="/admin/orders" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-medium">Manage Orders</span>
          </Link>
          
          <Link to="/admin/users" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium">Manage Users</span>
          </Link>
          
          <Link to="/admin/site-config" className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition flex flex-col items-center justify-center">
            <svg className="w-10 h-10 text-yellow-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Site Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}