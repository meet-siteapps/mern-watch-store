import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
import SkeletonLoader from "../components/SkeletonLoader";
import api from "../utils/api";

export default function HomeProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCartId, setAddedToCartId] = useState(null);
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { addToCart, fetchCartItems } = useContext(CartContext); // Added fetchCartItems here
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites() || {};
  const { user } = useUser();

  // Fetch recent products from backend
  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make API request to get recent products
        // const response = await axios.get("http://localhost:3000/watches/get-recent-products");
        const response = await axios.get("https://mern-watch-store.onrender.com/watches/get-recent-products");
        
        // Check if response is successful
        if (response.data.status === "Success") {
          // Transform backend data to match frontend needs
          const productsData = response.data.data.map(product => ({
            id: product._id,         // MongoDB _id becomes our id
            name: product.name,
            price: product.price,
            image: product.url,      // Backend uses 'url' for image
            brand: product.brand,
            category: product.category,
            inStock: product.inStock // Add stock information
          }));
          
          // Update state with transformed data
          setProducts(productsData);
        } else {
          // Handle API error response
          setError(response.data.message || "Failed to fetch products");
        }
      } catch (err) {
        // Handle network or server errors
        console.error("Error fetching products:", err);
        setError("An error occurred while fetching products");
      } finally {
        // Always hide loading state
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchRecentProducts();
  }, []); // Empty dependency array means this runs only once

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Updated handleAddToCart function to communicate with backend
  const handleAddToCart = async (product) => {
    if (!user) {
      showNotification('Please log in to add items to your cart', 'auth');
      return;
    }
    
    // Check if product is in stock
    if (!product.inStock) {
      showNotification('This product is currently out of stock', 'error');
      return;
    }
    
    try {
      // Add to the backend cart
      const response = await api.put('/cart/add-to-cart', { quantity: 1 }, {
        headers: { watchid: product.id.toString() }
      });
      
      if (response.data.status === "success") {
        // Only update the UI state, don't call addToCart again
        setAddedToCartId(product.id);
        showNotification('Added to cart!', 'success');
        
        // Refresh cart items from the backend to get the updated state
        await fetchCartItems();
        
        setTimeout(() => setAddedToCartId(null), 2000);
      } else {
        // Handle backend error response
        showNotification(response.data.message || 'Failed to add item to cart', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Error adding item to cart', 'error');
    }
  };

  // Rest of the component remains the same...
  const toggleFavorite = async (product) => {
    if (!user) {
      showNotification('Please log in to add items to your favorites', 'auth');
      return;
    }
    
    try {
      if (isInFavorites(product.id)) {
        const success = await removeFromFavorites(product.id);
        if (success) {
          showNotification('Removed from favorites', 'favorite');
        } else {
          showNotification('Failed to remove from favorites', 'error');
        }
      } else {
        const success = await addToFavorites(product.id);
        if (success) {
          showNotification('Added to favorites', 'favorite');
        } else {
          showNotification('Failed to add to favorites', 'error');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Error updating favorites', 'error');
    }
  };


  return (
    <section className="relative py-16 min-h-screen overflow-hidden text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/10 to-yellow-500/10 blur-3xl animate-pulse"></div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px] z-0"></div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className={`relative rounded-xl shadow-xl overflow-hidden ${
            notification.type === 'auth' 
              ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' 
              : notification.type === 'error'
                ? 'bg-gradient-to-r from-red-600 to-red-500'
                : notification.type === 'favorite'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500'
          }`}>
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4 flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black bg-opacity-20 mr-3">
                {notification.type === 'auth' ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : notification.type === 'error' ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill={notification.type === 'favorite' ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{notification.message}</p>
                {notification.type === 'auth' && (
                  <div className="mt-1">
                    <Link 
                      to="/login" 
                      className="text-blue-200 hover:text-blue-100 underline text-sm"
                    >
                      Log in now
                    </Link>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: '' })}
                className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Section Header with Animation */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Latest Timepieces
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover our newest collection of premium watches, crafted with precision and elegance.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center mb-12">
          <Link 
            to="/products" 
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <span className="font-medium">View All Products</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>

        {/* Error Message */}
        {error && !loading && (
          <div className="text-center mt-10 py-10 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:scale-105 transition duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <SkeletonLoader type="product" count={4} />
            ) : (
              products.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 transition-all duration-500 hover:shadow-2xl hover:border-blue-500/30 hover:scale-[1.03] animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container with Overlay Effect */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300x200?text=Watch+Image";
                      }}
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product)}
                      disabled={!user}
                      className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                        !user 
                          ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                          : isInFavorites && isInFavorites(product.id)
                            ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white'
                            : 'bg-gray-900/70 text-gray-300 hover:text-pink-400 hover:bg-gray-800/80'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 ${isInFavorites && isInFavorites(product.id) ? 'fill-current' : ''}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                    
                    {/* Product Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold rounded-full">
                        NEW
                      </div>
                      {!product.inStock && (
                        <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold rounded-full">
                          OUT OF STOCK
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">{product.name}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                        {product.brand}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-5">
                      <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        ${product.price}
                      </p>
                      <div className="flex items-center text-yellow-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm">4.8</span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      <p className={product.inStock ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!user || !product.inStock}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-xl transition-all duration-300 ${
                          !user || !product.inStock
                            ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                            : addedToCartId === product.id
                              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        }`}
                      >
                        {addedToCartId === product.id ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Added!
                          </>
                        ) : !product.inStock ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="px-4 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition duration-300 hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center mt-10 py-10 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl text-gray-400">No recent products available.</p>
          </div>
        )}

        {/* Login Prompt for Non-logged Users */}
        {!loading && !error && !user && products.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 backdrop-blur-sm border border-yellow-700/50 rounded-2xl text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-xl font-bold text-yellow-300">Login Required</h3>
            </div>
            <p className="text-yellow-200 mb-4">
              Please <Link to="/login" className="text-blue-400 hover:text-blue-300 underline font-medium">log in</Link> to add items to cart or favorites.
            </p>
            <Link 
              to="/login" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold rounded-lg hover:scale-105 transition duration-300"
            >
              Login Now
            </Link>
          </div>
        )}
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}