// src/pages/admin/Orders.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function AdminOrders() {
  const { user, getToken } = useUser();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }
      
      console.log("Fetching orders with token:", token);
      
      const response = await api.get('/orders/get-all-orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Orders response:", response.data);
      setOrders(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("Network error: Unable to connect to the server. Please check your internet connection and ensure the server is running.");
      } else {
        console.error("Error message:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Placed": return "bg-blue-900/30 text-blue-400";
      case "Processing": return "bg-yellow-900/30 text-yellow-400";
      case "Shipped": return "bg-purple-900/30 text-purple-400";
      case "Delivered": return "bg-green-900/30 text-green-400";
      case "Cancelled": return "bg-red-900/30 text-red-400";
      default: return "bg-gray-900/30 text-gray-400";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setUpdatingStatus(false);
        return;
      }
      
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      
      await api.put(`/orders/update-status/${orderId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // If the selected order is being updated, update that too
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError("Network error: Unable to connect to the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      console.log(`Fetching details for order ${orderId}`);
      
      const response = await api.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Order details response:", response.data);
      setSelectedOrder(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        setError("Network error: Unable to connect to the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
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

  // Filter orders based on status filter
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Order Management</h1>
          <p className="text-gray-400">View and manage all customer orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchOrders}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="w-full md:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-750">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4">
                      <SkeletonLoader type="table" />
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">#{getOrderNumber(order)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {order.user?.username || order.user?.name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.user?.email || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status || 'Unknown'}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingStatus}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="Placed" className="bg-gray-800">Placed</option>
                          <option value="Processing" className="bg-gray-800">Processing</option>
                          <option value="Shipped" className="bg-gray-800">Shipped</option>
                          <option value="Delivered" className="bg-gray-800">Delivered</option>
                          <option value="Cancelled" className="bg-gray-800">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      {orders.length === 0 ? "No orders found" : "No orders match your filter"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order Number:</span>
                      <span className="text-white">#{getOrderNumber(selectedOrder)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <select
                        value={selectedOrder.status || 'Unknown'}
                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="Placed" className="bg-gray-800">Placed</option>
                        <option value="Processing" className="bg-gray-800">Processing</option>
                        <option value="Shipped" className="bg-gray-800">Shipped</option>
                        <option value="Delivered" className="bg-gray-800">Delivered</option>
                        <option value="Cancelled" className="bg-gray-800">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white">{selectedOrder.paymentMethod || 'N/A'}</span>
                    </div>
                    {selectedOrder.isPaid && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Paid On:</span>
                        <span className="text-white">{selectedOrder.paidAt ? formatDate(selectedOrder.paidAt) : 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{selectedOrder.user?.username || selectedOrder.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedOrder.user?.email || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Shipping Address</h3>
                  <div className="text-white">
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p>{selectedOrder.shippingAddress.fullName}</p>
                        <p>{selectedOrder.shippingAddress.address}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                        <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                      </>
                    ) : (
                      <p>No shipping address available</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-750 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Items:</span>
                      <span className="text-white">${selectedOrder.itemsPrice ? selectedOrder.itemsPrice.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax:</span>
                      <span className="text-white">${selectedOrder.taxPrice ? selectedOrder.taxPrice.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping:</span>
                      <span className="text-white">${selectedOrder.shippingPrice ? selectedOrder.shippingPrice.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                      <span className="text-gray-300">Total:</span>
                      <span className="text-white">${selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-750 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {item.product?.image ? (
                                <img 
                                  src={item.product.url} 
                                  alt={item.product.name || 'Product'} 
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{item.product?.name || 'Unknown Product'}</div>
                              <div className="text-sm text-gray-400">{item.product?.brand || ''}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                              ${item.price ? item.price.toFixed(2) : '0.00'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                              ${(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}