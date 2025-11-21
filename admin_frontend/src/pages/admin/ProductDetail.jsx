// src/pages/admin/AdminProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import SkeletonLoader from "../../components/SkeletonLoader";
import api from "../../utils/api";

export default function AdminProductDetail() {
  const { id } = useParams();
  const { getToken } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, productName: '' });
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    category: '',
    inStock: true,
    features: [],
    url: ''
  });
  const [newFeature, setNewFeature] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }
        
        // Fetch product from backend API using the api utility
        const response = await api.get(`/watches/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Product detail response:", response.data);
        
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
            inStock: response.data.data.inStock !== false, // Default to true if not specified
            features: response.data.data.features || []
          };
          
          setProduct(productData);
          setFormData({
            name: productData.name,
            brand: productData.brand,
            price: productData.price,
            description: productData.description,
            category: productData.category,
            inStock: productData.inStock,
            features: productData.features,
            url: productData.url
          });
        } else {
          // Handle API error response
          setError(response.data.message || "Failed to fetch product");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        
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

    fetchProduct();
  }, [id, getToken]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setIsSaving(false);
        return;
      }
      
      console.log("Updating product:", formData);
      
      const response = await api.put(`/watches/update-product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Update response:", response.data);
      
      if (response.data.status === "success" || response.data.message === "Product updated successfully") {
        // Update local state
        setProduct(prev => ({
          ...prev,
          ...formData
        }));
        showNotification('Product updated successfully', 'success');
        setIsEditing(false);
      } else {
        showNotification(response.data.message || 'Failed to update product', 'error');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response) {
        showNotification(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`, 'error');
      } else if (err.request) {
        showNotification("Network error: Unable to connect to the server.", 'error');
      } else {
        showNotification(`Error: ${err.message}`, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original product data
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        category: product.category,
        inStock: product.inStock,
        features: product.features,
        url: product.url
      });
    }
    setIsEditing(false);
  };

  const handleDeleteProduct = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      
      console.log(`Deleting product ${id}`);
      
      const response = await api.delete(`/watches/delete-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Delete response:", response.data);
      
      if (response.data.message === "Product Deleted" || response.data.status === "success") {
        showNotification('Product deleted successfully', 'success');
        setDeleteConfirmation({ show: false, productName: '' });
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        showNotification(response.data.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      
      // Handle 401 Unauthorized error specifically
      if (err.response && err.response.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (err.response) {
        showNotification(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`, 'error');
      } else if (err.request) {
        showNotification("Network error: Unable to connect to the server.", 'error');
      } else {
        showNotification(`Error: ${err.message}`, 'error');
      }
    }
  };

  const confirmDelete = () => {
    setDeleteConfirmation({ show: true, productName: formData.name });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, productName: '' });
  };

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
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-white text-black font-bold rounded-lg 
             shadow-[0_0_15px_rgba(255,255,255,0.8)]
             hover:shadow-[0_0_25px_rgba(255,255,255,1),0_0_50px_rgba(255,255,255,0.8)]
             hover:scale-105 
             transition duration-300"
          >
            Back to Products
          </button>
        </div>
      </section>
    );
  }

  const categories = ["Luxury", "Sports", "Smart", "Vintage", "Casual"];
  const brands = ["Rolex", "Omega", "Tag Heuer", "Breitling", "Patek Philippe"];

  return (
    <section className="relative pt-24 pb-12 min-h-screen text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-95"></div>

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

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
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
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
              >
                Delete
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
                  src={formData.url}
                  alt={formData.name}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200?text=Watch+Image";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Details/Form */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-400 drop-shadow-lg">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-300 w-full text-3xl md:text-4xl font-extrabold"
                      placeholder="Product name"
                    />
                  ) : (
                    formData.name
                  )}
                </h1>
                <p className="text-lg text-gray-400 mt-1">
                  {isEditing ? (
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-300 w-full text-lg text-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23ffffff' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '12px',
                        paddingRight: '1.5rem',
                        appearance: 'none',
                        WebkitAppearance: 'none'
                      }}
                    >
                      <option value="" className="bg-gray-800 text-white">Select brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand} className="bg-gray-800 text-white">{brand}</option>
                      ))}
                    </select>
                  ) : (
                    `by ${formData.brand}`
                  )}
                </p>
              </div>
              
              {/* Edit/Save/Cancel Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:scale-105 transition flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:scale-105 transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:scale-105 transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mt-2">
              <p className="text-3xl md:text-4xl font-bold text-blue-500 drop-shadow-md">
                {isEditing ? (
                  <div className="flex items-center">
                    <span className="mr-1 text-3xl md:text-4xl font-bold">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="bg-transparent border-b border-blue-500 focus:outline-none focus:border-blue-300 w-32 text-3xl md:text-4xl font-bold"
                      min="0"
                      step="0.01"
                    />
                  </div>
                ) : (
                  `$${formData.price}`
                )}
              </p>
              <p className={formData.inStock ? "text-green-500 mt-1" : "text-red-500 mt-1"}>
                {formData.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={4}
                  placeholder="Product description"
                />
              ) : (
                <p className="text-gray-300">{formData.description}</p>
              )}
            </div>

            {/* Features */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Features</h3>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a new feature"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-500"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-sm text-blue-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mt-2">
              <h3 className="text-lg font-medium mb-2">Category</h3>
              {isEditing ? (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23ffffff' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '12px',
                    paddingRight: '1.5rem',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">{category}</option>
                  ))}
                </select>
              ) : (
                <span className="px-3 py-1 bg-gradient-to-r from-purple-900 to-purple-800 text-purple-300 rounded-full text-sm">
                  {formData.category}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Stock Status</h3>
              {isEditing ? (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-gray-300">In Stock</label>
                </div>
              ) : (
                <p className={formData.inStock ? "text-green-500" : "text-red-500"}>
                  {formData.inStock ? "In Stock" : "Out of Stock"}
                </p>
              )}
            </div>

            {/* Image URL */}
            {isEditing && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Image URL</h3>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-blue-400 transition"
              >
                ← Back to Products
              </button>
              
              {!isEditing && (
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:scale-105 transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        /* Custom styling for select dropdown options */
        select option {
          background-color: #1f2937;
          color: white;
        }
      `}</style>
    </section>
  );
}