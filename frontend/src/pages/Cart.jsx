import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, fetchCartItems } = useContext(CartContext);
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isInitialMount = useRef(true);
  const prevCartItemsLength = useRef(0);
  const isInitialLoad = useRef(true); // Track initial load

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

  // Memoize the fetch function to prevent unnecessary re-renders
  const loadCart = useCallback(async () => {
    // Only fetch cart if user is logged in
    if (!user) {
      setLoading(false);
      setIsCartEmpty(true);
      return;
    }
    
    // Only set loading to true on initial load
    if (isInitialLoad.current) {
      setLoading(true);
    }
    setError(null);
    try {
      await fetchCartItems();
    } catch (err) {
      setError('Failed to fetch cart items. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      if (isInitialLoad.current) {
        setLoading(false);
        isInitialLoad.current = false; // Mark initial load as complete
      }
    }
  }, [fetchCartItems, user]);

  useEffect(() => {
    // Only run on initial mount
    if (isInitialMount.current) {
      loadCart();
      isInitialMount.current = false;
    }
  }, [loadCart]);

  // Check if cart is empty - use a stable approach to avoid rapid toggling
  useEffect(() => {
    if (!loading) {
      // Only update if the cart length has actually changed
      if (prevCartItemsLength.current !== cartItems.length) {
        setIsCartEmpty(cartItems.length === 0);
        prevCartItemsLength.current = cartItems.length;
      }
    }
  }, [cartItems, loading]);

  // Effect to handle user login/logout
  useEffect(() => {
    if (!isInitialMount.current) {
      if (user) {
        // User just logged in, fetch cart
        loadCart();
      } else {
        // User logged out, reset cart state
        setLoading(false);
        setIsCartEmpty(true);
      }
    }
  }, [user, loadCart]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleRemoveItem = useCallback(async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingItems(prev => ({...prev, [id]: true}));
    try {
      // Find the item to get its quantity
      const item = cartItems.find(item => item.id === id);
      if (!item) {
        setError('Item not found in cart.');
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Remove all quantities by calling removeFromCart multiple times
      for (let i = 0; i < item.quantity; i++) {
        const success = await removeFromCart(id);
        if (!success) {
          setError('Failed to remove item from cart. Please try again.');
          setTimeout(() => setError(null), 3000);
          break;
        }
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError(`An error occurred: ${err.message || 'Failed to remove item'}`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setRemovingItems(prev => ({...prev, [id]: false}));
    }
  }, [removeFromCart, cartItems]);

  const handleUpdateQuantity = useCallback(async (id, newQuantity, e) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdatingItems(prev => ({...prev, [id]: true}));
    try {
      await updateQuantity(id, newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdatingItems(prev => ({...prev, [id]: false}));
    }
  }, [updateQuantity]);

  const handleCheckout = useCallback((e) => {
    e.preventDefault();
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      setError('Your cart is empty. Add some products before proceeding to checkout.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [user, navigate, cartItems]);

  // Calculate totals
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <section className="relative py-20 min-h-screen text-white overflow-hidden">
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

      {/* Error Message with Retry */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-xl shadow-lg animate-fadeIn flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{error}</span>
          <button 
            onClick={loadCart}
            className="ml-4 underline"
            aria-label="Retry fetching cart items"
          >
            Retry
          </button>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Cart Header with Badge - Only show if user is logged in */}
        {user && (
          <div className="mb-12">
            <div className="inline-block px-4 py-1 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm font-semibold text-white shadow-lg">
              SHOPPING CART
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Your Cart
              </h1>
              <div className="flex items-center mt-4 md:mt-0">
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold rounded-full h-10 w-10 flex items-center justify-center shadow-lg mr-4">
                    {totalItems}
                  </span>
                )}
                <Link to="/products" className="text-blue-400 hover:text-blue-300 transition flex items-center group">
                  <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        )}

        {/* Login Required Prompt */}
        {!user && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-white bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 p-12 animate-fadeIn">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4">Access Your Cart</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
                Please log in to your account to view and manage your cart.
              </p>
              <Link to="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-indigo-500 hover:scale-105 transition-all duration-300">
                Log In to Your Account
                <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Cart Content - Only show if user is logged in */}
        {user && (
          <div className="transition-opacity duration-300">
            {/* Empty Cart State - Rendered in the same DOM structure */}
            {isCartEmpty && !loading ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-white bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700 p-12 animate-fadeIn">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Your Cart is Empty</h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any watches yet. Let's fix that!
                  </p>
                  <Link to="/products" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-indigo-500 hover:scale-105 transition-all duration-300">
                    Browse Products
                    <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="grid grid-cols-1 gap-8">
                  {loading && isInitialLoad.current ? (
                    <SkeletonLoader type="product" count={3} />
                  ) : (
                    cartItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-gray-700 relative overflow-hidden animate-fadeIn"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Adaptive Glow Background */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-500/10 blur-xl animate-pulse-slow pointer-events-none"></div>

                        {/* Product Image */}
                        <div className="relative z-10">
                          <img
                            src={item.url || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="w-32 h-32 object-contain rounded-2xl bg-gray-800/50 backdrop-blur-sm p-4 border border-gray-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col gap-3 relative z-10">
                          <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold">{item.name}</h2>
                            <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-400">Brand: {item.brand || 'Luxury Watch'}</p>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-4 mt-2">
                            <span className="font-medium text-gray-300">Quantity:</span>
                            <div className="flex items-center bg-gray-700/50 rounded-xl overflow-hidden border border-gray-600">
                              <button
                                type="button"
                                className="px-4 py-2 hover:bg-gray-600 transition disabled:opacity-50 flex items-center justify-center"
                                onClick={(e) => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1), e)}
                                disabled={item.quantity <= 1 || updatingItems[item.id]}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                {updatingItems[item.id] ? (
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                  </svg>
                                )}
                              </button>
                              <span className="px-4 py-2 bg-gray-800 w-12 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                className="px-4 py-2 hover:bg-gray-600 transition flex items-center justify-center"
                                onClick={(e) => handleUpdateQuantity(item.id, item.quantity + 1, e)}
                                disabled={updatingItems[item.id]}
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                {updatingItems[item.id] ? (
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => handleRemoveItem(item.id, e)}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-300 relative z-10 flex items-center"
                          disabled={removingItems[item.id]}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          {removingItems[item.id] ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Removing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Total & Checkout */}
                <div className="mt-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 shadow-xl">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {loading && isInitialLoad.current ? (
                      <SkeletonLoader type="text" count={1} />
                    ) : (
                      <div className="flex items-center">
                        <h2 className="text-3xl font-bold">
                          Total: <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">${totalPrice.toFixed(2)}</span>
                        </h2>
                        <span className="ml-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold rounded-full h-12 w-12 flex items-center justify-center shadow-lg">
                          {totalItems}
                        </span>
                      </div>
                    )}
                    {loading && isInitialLoad.current ? (
                      <SkeletonLoader type="button" />
                    ) : (
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                        className={`relative inline-block px-10 py-4 text-white font-bold rounded-2xl transition-all duration-300 overflow-hidden group hover:scale-105 ${
                          cartItems.length === 0 
                            ? 'bg-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                        }`}
                        aria-label={user ? "Proceed to checkout" : "Login to checkout"}
                      >
                        {/* Glow Background */}
                        <span className={`absolute inset-0 blur-xl filter ${
                          cartItems.length === 0 
                            ? 'bg-gray-500 opacity-30' 
                            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 opacity-30 animate-pulse-slow'
                        }`}></span>
                        {/* Button Text */}
                        <span className="relative z-10 flex items-center text-lg">
                          {cartItems.length === 0 ? (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              Cart is Empty
                            </>
                          ) : (
                            "Proceed to Checkout"
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}