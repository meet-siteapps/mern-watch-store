// src/pages/ProductDetail.jsx
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useFavorites } from "../context/FavoritesContext";
import { useUser } from "../context/UserContext";
import SkeletonLoader from "../components/SkeletonLoader";
import axios from "axios";
import api from "../utils/api"; // Import the api instance


export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, isInFavorites, loading: favLoading } = useFavorites();
  const { user } = useUser();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [cartNotification, setCartNotification] = useState(false);
  const [favoritesNotification, setFavoritesNotification] = useState({ show: false, message: '', isAdd: true });
  const [authNotification, setAuthNotification] = useState({ show: false, message: '' });
  const quantityRef = useRef(quantity);

  useEffect(() => {
    quantityRef.current = quantity;
  }, [quantity]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch product from backend API - updated URL to match the pattern
        const response = await axios.get(`http://localhost:3000/watches/${id}`);
        
        // Check if response is successful
        if (response.data.status === "Success") {
          // Transform backend data to match frontend needs
          const productData = {
            id: response.data.data._id, // MongoDB _id becomes our id
            name: response.data.data.name,
            price: response.data.data.price,
            url: response.data.data.url, // Image URL
            brand: response.data.data.brand,
            category: response.data.data.category,
            description: response.data.data.description,
            inStock: response.data.data.inStock,
            features: response.data.data.features || []
          };
          
          setProduct(productData);
        } else {
          // Handle API error response
          setError(response.data.message || "Failed to fetch product");
        }
      } catch (err) {
        // Handle network or server errors
        console.error("Error fetching product:", err);
        setError("An error occurred while fetching the product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="relative pt-24 pb-12 min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <SkeletonLoader type="product" count={1} />
            </div>
            <div className="lg:w-1/2">
              <div className="space-y-6">
                <SkeletonLoader type="text" count={3} />
                <div className="h-32 bg-gray-800 rounded-xl"></div>
                <div className="h-64 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="relative pt-24 pb-12 min-h-screen text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-xl mb-6">{error || "Product not found"}</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-white text-black font-bold rounded-lg 
             shadow-[0_0_15px_rgba(255,255,255,0.8)]
             hover:shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(255,255,255,0.8)]
             hover:scale-105 
             transition duration-300"
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

// In ProductDetail.jsx, update the handleAddToCart function:

const handleAddToCart = async () => {
  if (!product) return;
  
  if (!user) {
    setAuthNotification({
      show: true,
      message: 'Please log in to add items to your cart'
    });
    
    setTimeout(() => {
      setAuthNotification(prev => ({ ...prev, show: false }));
    }, 3000);
    return;
  }
  
  try {
    // First, add to the backend cart
    const response = await api.put('/cart/add-to-cart', {}, {
      headers: { watchid: product.id.toString() }
    });
    
    if (response.data.status === "success") {
      // Then update the frontend cart state
      console.log('Adding to cart:', product, 'Quantity:', quantityRef.current);
      addToCart({ ...product, quantity: quantityRef.current });
      setIsAddedToCart(true);
      setCartNotification(true);
      
      setTimeout(() => {
        setCartNotification(false);
      }, 3000);
      
      setTimeout(() => setIsAddedToCart(false), 2000);
    } else {
      // Handle backend error response
      setAuthNotification({
        show: true,
        message: response.data.message || 'Failed to add item to cart'
      });
      
      setTimeout(() => {
        setAuthNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    setAuthNotification({
      show: true,
      message: 'Error adding item to cart'
    });
    
    setTimeout(() => {
      setAuthNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }
};


// In ProductDetail.jsx, update the toggleFavorite function:
const toggleFavorite = async () => {
  if (!product) {
    console.error('No product data available');
    return;
  }
  
  if (!user) {
    setAuthNotification({
      show: true,
      message: 'Please log in to add items to your favorites'
    });
    
    setTimeout(() => {
      setAuthNotification(prev => ({ ...prev, show: false }));
    }, 3000);
    return;
  }
  
  try {
    if (isInFavorites(product.id)) {
      const success = await removeFromFavorites(product.id);
      if (success) {
        setFavoritesNotification({ 
          show: true, 
          message: 'Removed from favorites', 
          isAdd: false 
        });
      } else {
        setFavoritesNotification({ 
          show: true, 
          message: 'Failed to remove from favorites', 
          isAdd: false 
        });
      }
    } else {
      const success = await addToFavorites(product.id);
      if (success) {
        setFavoritesNotification({ 
          show: true, 
          message: 'Added to favorites', 
          isAdd: true 
        });
      } else {
        setFavoritesNotification({ 
          show: true, 
          message: 'Failed to add to favorites', 
          isAdd: true 
        });
      }
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    setFavoritesNotification({ 
      show: true, 
      message: 'Error updating favorites', 
      isAdd: false 
    });
  }
  
  setTimeout(() => {
    setFavoritesNotification(prev => ({ ...prev, show: false }));
  }, 3000);
};


  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  // Sample review data - you might want to fetch this from backend too
  const reviewData = [
    { stars: 5, count: 30 },
    { stars: 4, count: 8 },
    { stars: 3, count: 3 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 }
  ];

  const totalReviews = reviewData.reduce((sum, review) => sum + review.count, 0);
  const averageRating = reviewData.reduce((sum, review) => sum + review.stars * review.count, 0) / totalReviews;

  return (
    <section className="relative pt-24 pb-12 min-h-screen text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>

      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn md:top-6 md:right-6">
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4 flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black bg-opacity-20 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Added to cart!</p>
              </div>
              <button 
                onClick={() => setCartNotification(false)}
                className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Notification */}
      {favoritesNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn md:top-6 md:right-6" style={{ marginTop: cartNotification.show ? '5.5rem' : '0' }}>
          <div className={`relative rounded-xl shadow-xl overflow-hidden ${
            favoritesNotification.isAdd 
              ? 'bg-gradient-to-r from-pink-600 to-rose-500' 
              : 'bg-gradient-to-r from-gray-700 to-gray-600'
          }`}>
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4 flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black bg-opacity-20 mr-3">
                <svg 
                  className={`w-6 h-6 ${favoritesNotification.isAdd ? 'text-white' : 'text-gray-300'}`} 
                  fill={favoritesNotification.isAdd ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{favoritesNotification.message}</p>
              </div>
              <button 
                onClick={() => setFavoritesNotification(prev => ({ ...prev, show: false }))}
                className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Notification */}
      {authNotification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn md:top-6 md:right-6" style={{ 
          marginTop: (cartNotification.show ? '5.5rem' : '0') + (favoritesNotification.show ? '5.5rem' : '0')
        }}>
          <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10"></div>
            <div className="relative p-4 flex items-center">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black bg-opacity-20 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{authNotification.message}</p>
                <div className="mt-1">
                  <Link 
                    to="/login" 
                    className="text-blue-200 hover:text-blue-100 underline text-sm"
                  >
                    Log in now
                  </Link>
                </div>
              </div>
              <button 
                onClick={() => setAuthNotification(prev => ({ ...prev, show: false }))}
                className="ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-20 transition"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 opacity-30 blur-3xl transition-all duration-500 group-hover:opacity-60"></div>
              <div className="relative bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 flex items-center justify-center p-6 min-h-[500px]">
                <img
                  src={product.url} // Use 'url' field from backend model
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Watch+Image";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-400 drop-shadow-lg">
                {product.name}
              </h1>
              <p className="text-lg text-gray-400 mt-1">by {product.brand}</p>
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 ml-2">({totalReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              <p className="text-3xl md:text-4xl font-bold text-blue-500 drop-shadow-md">
                ${product.price}
              </p>
              <p className={product.inStock ? "text-green-500 mt-1" : "text-red-500 mt-1"}>
                {product.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
              </p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-300">{product.description}</p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 mt-4">
              {product.features && product.features.map((feature, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-blue-400 hover:bg-gray-700 hover:text-blue-300 transition"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* Category */}
            <div className="mt-2">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-900 to-purple-800 text-purple-300 rounded-full text-sm">
                {product.category}
              </span>
            </div>

            {/* Quantity Selector and CTA Buttons */}
            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Quantity Selector */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button 
                      onClick={decrementQuantity}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-l-lg text-gray-200 transition ${
                        !product.inStock 
                          ? 'bg-gray-800 border border-gray-700 cursor-not-allowed' 
                          : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      -
                    </button>
                    <div className="px-6 py-2 bg-gray-900 border-t border-b border-gray-700 text-center w-16">
                      {quantity}
                    </div>
                    <button 
                      onClick={incrementQuantity}
                      disabled={!product.inStock}
                      className={`px-4 py-2 rounded-r-lg text-gray-200 transition ${
                        !product.inStock 
                          ? 'bg-gray-800 border border-gray-700 cursor-not-allowed' 
                          : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={!user || !product.inStock}
                    className={`px-6 py-3 font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex-1 flex items-center justify-center gap-2 ${
                      !user || !product.inStock
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : isAddedToCart 
                          ? 'bg-gradient-to-r from-green-600 to-green-500 text-white' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    }`}
                  >
                    {isAddedToCart ? (
                      <>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>
                  <button
                    onClick={toggleFavorite}
                    disabled={!user || favLoading}
                    className={`px-6 py-3 font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 flex-1 flex items-center justify-center gap-2 ${
                      !user || favLoading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : isInFavorites && isInFavorites(product.id) 
                          ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white' 
                          : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 hover:text-pink-400'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 ${isInFavorites && isInFavorites(product.id) ? 'fill-current' : ''}`} 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {favLoading ? 'Loading...' : (isInFavorites && isInFavorites(product.id) ? 'Favorited' : 'Favorite')}
                  </button>
                </div>
              </div>
              
              {/* Login Prompt for Non-logged Users */}
              {!user && (
                <div className="mt-4 text-center text-sm text-gray-400">
                  Please <Link to="/login" className="text-blue-400 hover:text-blue-300 underline">log in</Link> to add items to cart or favorites
                </div>
              )}
              
              {/* Out of Stock Message */}
              {!product.inStock && (
                <div className="mt-4 text-center text-sm text-red-400">
                  This product is currently out of stock
                </div>
              )}
            </div>

            {/* Rating Progression Bar */}
            <div className="mt-4 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Customer Reviews</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-yellow-400">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">/5</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {reviewData.map((review) => (
                  <div key={review.stars} className="flex items-center">
                    <div className="w-16 text-sm text-gray-400 flex items-center">
                      {review.stars} star{review.stars > 1 ? 's' : ''}
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden mx-3">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full" 
                        style={{ width: `${(review.count / totalReviews) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-sm text-gray-400 text-right">
                      {review.count}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <button className="text-blue-400 hover:text-blue-300 transition">
                  Write a review
                </button>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-blue-400 transition w-full sm:w-auto"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
      
    </section>
  );
}