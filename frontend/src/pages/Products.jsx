import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
import SkeletonLoader from "../components/SkeletonLoader";
import api from "../utils/api"; // Import the api instance

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("latest");
  const [brand, setBrand] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [addedToCartId, setAddedToCartId] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { addToCart, fetchCartItems } = useContext(CartContext); // Added fetchCartItems here
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites() || {};
  const { user } = useUser();

  // Scroll to top when component mounts (on refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Fetch products from backend using Axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make API request using Axios
        // const response = await axios.get("http://localhost:3000/watches/get-all-products");
        const response = await axios.get("https://mern-watch-store.onrender.com/watches/get-all-products");
        
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
          setAllProducts(productsData);
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
    fetchProducts();
  }, []); // Empty dependency array means this runs only once

  // Filter and sort products when dependencies change
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Apply brand filter
    if (brand !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    // Apply price filter
    if (priceRange !== "all") {
      if (priceRange === "under500") {
        filteredProducts = filteredProducts.filter((p) => p.price < 500);
      } else if (priceRange === "500to2000") {
        filteredProducts = filteredProducts.filter(
          (p) => p.price >= 500 && p.price <= 2000
        );
      } else if (priceRange === "above2000") {
        filteredProducts = filteredProducts.filter((p) => p.price > 2000);
      }
    }

    // Sort products
    if (sort === "priceLow") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "priceHigh") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
    // For "latest", we don't need to sort as backend returns newest first

    setDisplayedProducts(filteredProducts);
  }, [allProducts, sort, brand, priceRange]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Updated handleAddToCart function to communicate with backend and check stock
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
      // Add to the backend cart with explicit quantity of 1
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
    <section className="relative py-20 min-h-screen overflow-hidden text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/10 to-yellow-500/10 blur-3xl animate-pulse"></div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px] z-0"></div>

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
                  : notification.type === 'success'
                    ? 'bg-gradient-to-r from-green-600 to-green-500'
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
                ) : notification.type === 'success' ? (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm font-semibold text-white shadow-lg">
            LUXURY COLLECTION
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Premium Timepieces
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover our exclusive collection of luxury watches, crafted with precision and elegance.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Filters + Sorting */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-10 border border-gray-700 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {loading ? (
                <SkeletonLoader type="button" count={2} />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-gray-300 font-medium text-sm sm:text-base">Brand:</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="p-2 sm:p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Brands</option>
                      <option value="rolex">Rolex</option>
                      <option value="omega">Omega</option>
                      <option value="tag heuer">Tag Heuer</option>
                      <option value="patek philippe">Patek Philippe</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-gray-300 font-medium text-sm sm:text-base">Price:</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="p-2 sm:p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                      <option value="all">All Prices</option>
                      <option value="under500">Under $500</option>
                      <option value="500to2000">$500 – $2000</option>
                      <option value="above2000">Above $2000</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-gray-300 font-medium text-sm sm:text-base">Sort by:</label>
              {loading ? (
                <SkeletonLoader type="button" />
              ) : (
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="p-2 sm:p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              )}
            </div>
          </div>
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

        {/* Products Grid - Updated for 2 columns on mobile */}
        {!error && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              <SkeletonLoader type="product" count={8} />
            ) : (
              displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-500 hover:shadow-xl hover:border-blue-500/30 hover:scale-[1.03] animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container with Overlay Effect - Reduced height for mobile */}
                  <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64">
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
                    
                    {/* Favorite Button - Smaller on mobile */}
                    <button
                      onClick={() => toggleFavorite(product)}
                      disabled={!user}
                      className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
                        !user 
                          ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                          : isInFavorites && isInFavorites(product.id)
                            ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white'
                            : 'bg-gray-900/70 text-gray-300 hover:text-pink-400 hover:bg-gray-800/80'
                      }`}
                    >
                      <svg 
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${isInFavorites && isInFavorites(product.id) ? 'fill-current' : ''}`} 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                    
                    {/* Brand Badge - Smaller on mobile */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 z-10">
                      <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
                        {product.brand}
                      </div>
                      {/* Out of Stock Badge - smaller and positioned below brand */}
                      {!product.inStock && (
                        <div className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gradient-to-r from-red-600 to-red-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full">
                          OUT OF STOCK
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info - Reduced padding for mobile */}
                  <div className="p-3 sm:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-xl font-bold group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">{product.name}</h3>
                      <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-700 rounded-full text-gray-300 whitespace-nowrap">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3 sm:mb-5">
                      <p className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        ${product.price}
                      </p>
                      <div className="flex items-center text-yellow-400">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-xs sm:text-sm">4.8</span>
                      </div>
                    </div>

                    {/* Stock Status - Smaller text on mobile */}
                    <div className="mb-2 sm:mb-4">
                      <p className={product.inStock ? "text-green-500 text-xs sm:text-sm" : "text-red-500 text-xs sm:text-sm"}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>

                    {/* Actions - Smaller buttons on mobile */}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!user || !product.inStock}
                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm ${
                          !user || !product.inStock
                            ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed' 
                            : addedToCartId === product.id
                              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        }`}
                      >
                        {addedToCartId === product.id ? (
                          <>
                            <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Added!
                          </>
                        ) : !product.inStock ? (
                          <>
                            <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Add to Cart
                          </>
                        )}
                      </button>
                      <Link
                        to={`/product/${product.id}`}
                        className="px-2 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white font-bold rounded-lg sm:rounded-xl hover:bg-gray-600 transition duration-300 hover:scale-105"
                      >
                        <svg className="w-3 h-3 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="text-center mt-10 py-10 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl text-gray-400">No products match your filters.</p>
            <button 
              onClick={() => {
                setBrand("all");
                setPriceRange("all");
                setSort("latest");
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:scale-105 transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Login Prompt for Non-logged Users */}
        {!loading && !error && !user && displayedProducts.length > 0 && (
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}