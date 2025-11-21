// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function AdminProducts() {
  const { user, getToken } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("latest");
  const [brand, setBrand] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, productId: null, productName: '' });

  // Fetch products from backend using API utility
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        console.log("Fetching products with token");
        
        // Make API request using the api utility
        const response = await api.get('/watches/get-all-products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Products response:", response.data);
        
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
            description: product.description || "",
            inStock: product.inStock !== false, // Default to true if not specified
            features: product.features || []
          }));
          
          // Update state with transformed data
          setAllProducts(productsData);
        } else {
          // Handle API error response
          setError(response.data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        
        // Handle 401 Unauthorized error specifically
        if (err.response && err.response.status === 401) {
          setError("Your session has expired. Please log in again.");
          // You might want to redirect to login here
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

    // Call the fetch function
    fetchProducts();
  }, []);

  // Filter and sort products when dependencies change
  useEffect(() => {
    let filteredProducts = [...allProducts];
    
    // Apply brand filter
    if (brand !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.brand && p.brand.toLowerCase() === brand.toLowerCase()
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

  const handleDeleteProduct = async (productId, productName) => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      console.log(`Deleting product ${productId}`);
      
      const response = await api.delete(`/watches/delete-product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Delete response:", response.data);
      
      if (response.data.message === "Product Deleted" || response.data.status === "success") {
        // Remove product from state
        setAllProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        showNotification(`${productName} has been deleted`, 'success');
        setDeleteConfirmation({ show: false, productId: null, productName: '' });
      } else {
        showNotification(response.data.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
        // You might want to redirect to login here
      } else if (err.response) {
        showNotification(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`, 'error');
      } else if (err.request) {
        showNotification("Network error: Unable to connect to the server.", 'error');
      } else {
        showNotification(`Error: ${err.message}`, 'error');
      }
    }
  };

  const confirmDelete = (productId, productName) => {
    setDeleteConfirmation({ show: true, productId, productName });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, productId: null, productName: '' });
  };

  return (
    <section className="relative py-20 min-h-screen overflow-hidden text-white">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-95"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className={`relative rounded-xl shadow-xl overflow-hidden ${
            notification.type === 'error'
              ? 'bg-gradient-to-r from-red-600 to-red-500'
              : notification.type === 'success'
                ? 'bg-gradient-to-r from-green-600 to-green-500'
                : 'bg-gradient-to-r from-blue-600 to-blue-500'
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-2xl transform transition-all duration-300 scale-95 animate-scaleIn">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{deleteConfirmation.productName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteProduct(deleteConfirmation.productId, deleteConfirmation.productName)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with premium styling */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Watch Collection Management
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            Manage your premium watch collection with ease. Add, edit, or remove products from your inventory.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Product Management</h2>
          <Link
            to="/admin/products/add"
            className="mt-4 md:mt-0 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:scale-105 transition duration-300 flex items-center shadow-lg shadow-blue-500/20 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl backdrop-blur-sm">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded-lg hover:bg-red-600 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters + Sorting with enhanced styling */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 border border-gray-700 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 w-full md:w-auto">
              {loading ? (
                <SkeletonLoader type="button" count={2} />
              ) : (
                <>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-900/70 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto text-sm"
                  >
                    <option value="all">All Brands</option>
                    <option value="rolex">Rolex</option>
                    <option value="omega">Omega</option>
                    <option value="tag heuer">Tag Heuer</option>
                    <option value="patek philippe">Patek Philippe</option>
                  </select>

                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-900/70 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto text-sm"
                  >
                    <option value="all">All Prices</option>
                    <option value="under500">Under $500</option>
                    <option value="500to2000">$500 – $2000</option>
                    <option value="above2000">Above $2000</option>
                  </select>
                </>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center w-full md:w-auto">
              <label className="mr-2 sm:mr-3 font-semibold text-gray-300 text-sm sm:text-base">Sort by:</label>
              {loading ? (
                <SkeletonLoader type="button" />
              ) : (
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-900/70 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
                >
                  <option value="latest">Latest</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid with enhanced styling - Updated for 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <SkeletonLoader type="product" count={8} />
          ) : (
            displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-700 transform hover:-translate-y-1 sm:hover:-translate-y-2 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image Container with premium styling - Reduced height for mobile */}
                <div className="relative overflow-hidden h-40 sm:h-48 md:h-56 lg:h-64">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200?text=Watch+Image";
                    }}
                  />
                  
                  {/* Stock Badge with enhanced styling - Smaller on mobile */}
                  <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm z-20 ${
                    product.inStock 
                      ? 'bg-green-900/70 text-green-300 border border-green-700/50' 
                      : 'bg-red-900/70 text-red-300 border border-red-700/50'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>

                  {/* Action Buttons - Always visible on mobile/tablet, hover on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 sm:p-4 z-20 lg:bg-gradient-to-t lg:from-black/80 lg:via-transparent lg:to-transparent lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-full flex justify-between gap-1 sm:gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl hover:scale-105 transition duration-300 flex items-center justify-center shadow-md"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      <button
                        onClick={() => confirmDelete(product.id, product.name)}
                        className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl hover:scale-105 transition duration-300 flex items-center justify-center shadow-md"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info with enhanced styling - Reduced padding for mobile */}
                <div className="p-3 sm:p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm sm:text-xl font-bold text-white line-clamp-2">{product.name}</h3>
                    <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-blue-900/30 text-blue-300 border border-blue-700/50 whitespace-nowrap">
                      {product.brand}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 sm:mt-4">
                    <p className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                      ${product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* No Products with enhanced styling */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="text-center mt-12 sm:mt-16 py-8 sm:py-12 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-500 mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-lg sm:text-xl text-gray-400 mb-2">No products match your filters.</p>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your filter criteria to find what you're looking for.</p>
            <button 
              onClick={() => {
                setBrand("all");
                setPriceRange("all");
                setSort("latest");
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl hover:scale-105 transition duration-300 shadow-lg shadow-blue-500/20 text-sm sm:text-base"
            >
              Reset Filters
            </button>
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
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
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