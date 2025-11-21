import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../utils/api";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchLatestOrder = async () => {
      try {
        // Fetch the user's order history
        const response = await api.get('/orders/get-order-history');
        
        if (response.data.status === "success" && response.data.data.length > 0) {
          // Get the most recent order
          const latestOrder = response.data.data[0];
          console.log("Latest order:", latestOrder); // Debugging log
          setOrder(latestOrder);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestOrder();
  }, []);

  // Helper function to get the order number/ID from different possible fields
  const getOrderNumber = (order) => {
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
  };

  // Helper function to get product ID from different possible fields
  const getProductId = (item) => {
    if (!item) return 'N/A';
    
    // Check if product object exists and has _id
    if (item.product && item.product._id) {
      return item.product._id;
    }
    
    // Check if productId field exists directly on item
    if (item.productId) {
      return item.productId;
    }
    
    // Check if product is a string ID
    if (typeof item.product === 'string') {
      return item.product;
    }
    
    return 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Order Confirmation</h2>
          <p className="mb-6">We couldn't find your order details. Please check your order history.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/profile"
              className="relative inline-block px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition overflow-hidden"
            >
              <span className="relative z-10">View Order History</span>
            </Link>
            <Link
              to="/products"
              className="relative inline-block px-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition overflow-hidden"
            >
              <span className="relative z-10">Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get the order number using our helper function
  const orderNumber = getOrderNumber(order);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl text-center relative overflow-hidden">
        {/* Adaptive Glow Background */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-600 via-blue-600 to-green-500 opacity-20 blur-xl animate-pulse-slow pointer-events-none"></div>
        
        <div className="text-green-500 text-5xl mb-4 relative z-10">✓</div>
        <h2 className="text-3xl font-bold mb-4 relative z-10">Order Confirmed!</h2>
        <p className="mb-2 relative z-10">Thank you for your purchase.</p>
        
        {/* Order Number Display */}
        <div className="mb-6 bg-gray-900 p-4 rounded-lg border border-green-500 relative z-10">
          <p className="text-sm text-gray-300 mb-1">Your Order Number</p>
          <p className="text-2xl font-bold text-green-400">
            #{orderNumber}
          </p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg mb-6 relative z-10">
          <p className="mb-2">We've sent a confirmation email with your order details.</p>
          <p>You'll receive another notification when your order ships.</p>
        </div>
        
        <div className="mb-6 bg-gray-700 p-4 rounded-lg text-left relative z-10">
          <h3 className="font-bold mb-2">Order Details</h3>
          <div className="space-y-2 text-sm">
            {order.items && order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{item.product?.name || item.name || 'Product'}</div>
                  <div className="text-xs text-gray-400">ID: {getProductId(item)}</div>
                  <div className="text-xs">Qty: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div>${(item.price || item.product?.price || 0).toFixed(2)}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 border-t border-gray-600">
              <span>Total:</span>
              <span>${(order.totalPrice || order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 relative z-10">
          <Link
            to="/products"
            className="relative inline-block px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition overflow-hidden"
          >
            {/* Glow Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 opacity-50 blur-xl filter animate-pulse-slow"></span>
            {/* Button Text */}
            <span className="relative z-10">Continue Shopping</span>
          </Link>
          <Link
            to="/"
            className="relative inline-block px-6 py-3 bg-gray-700 rounded-lg font-bold hover:bg-gray-600 transition overflow-hidden"
          >
            {/* Glow Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 opacity-50 blur-xl filter animate-pulse-slow"></span>
            {/* Button Text */}
            <span className="relative z-10">Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}