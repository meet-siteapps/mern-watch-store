// src/pages/admin/AddProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    url: "",
    name: "",
    brand: "",
    price: "",
    description: "",
    features: [],
    category: "Luxury",
    inStock: true
  });
  const [newFeature, setNewFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const categories = ["Luxury", "Sports", "Smart", "Vintage", "Casual"];
  const brands = ["Rolex", "Omega", "Tag Heuer", "Breitling", "Patek Philippe"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await api.post("/watches/add-product", formData);
      
      if (response.status === 201) {
        setNotification({
          show: true,
          message: "Product added successfully!",
          type: "success"
        });
        
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        show: true,
        message: error.response?.data?.message || "Failed to add product",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Add New Product</h1>
          <p className="text-gray-400">Create a new product listing</p>
        </div>

        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg ${notification.type === "success" ? "bg-green-900/50 border border-green-700" : "bg-red-900/50 border border-red-700"}`}>
            <div className="flex items-center">
              <svg className={`w-6 h-6 mr-2 ${notification.type === "success" ? "text-green-400" : "text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notification.type === "success" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Features</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
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
                  placeholder="Add a feature"
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          <div className="flex justify-end mt-8 space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}