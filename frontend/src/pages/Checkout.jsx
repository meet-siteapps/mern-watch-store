import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import api from "../utils/api";

// Mock payment function - simulates payment processing
const processPayment = async () => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful payment 90% of the time
      if (Math.random() > 0.1) {
        resolve({
          success: true,
          transactionId: `txn_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
        });
      } else {
        reject(new Error("Payment failed. Please try again."));
      }
    }, 1500);
  });
};

export default function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Calculate total price directly from cart items
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [activeStep, setActiveStep] = useState(0); // 0: Shipping, 1: Payment, 2: Review
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Validation states
  const [shippingErrors, setShippingErrors] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  
  const [paymentErrors, setPaymentErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const steps = ["Shipping", "Payment", "Review"];

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

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Validation functions
  const validateShipping = () => {
    const errors = {
      fullName: shippingInfo.fullName.trim() === "" ? "Full name is required" : "",
      address: shippingInfo.address.trim() === "" ? "Address is required" : "",
      city: shippingInfo.city.trim() === "" ? "City is required" : "",
      postalCode: shippingInfo.postalCode.trim() === "" ? "Postal code is required" : "",
      country: shippingInfo.country.trim() === "" ? "Country is required" : "",
    };
    setShippingErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  const validatePayment = () => {
    // Validate expiry date
    const expiryDate = paymentInfo.expiryDate;
    const isValidExpiry = validateExpiryDate(expiryDate);
    
    const errors = {
      cardNumber: paymentInfo.cardNumber.replace(/\s/g, "").length !== 16 ? "Card number must be 16 digits" : "",
      expiryDate: !isValidExpiry ? "Expiry date must be a future date (MM/YY)" : "",
      cvv: paymentInfo.cvv.length < 3 || paymentInfo.cvv.length > 4 ? "CVV must be 3 or 4 digits" : "",
      nameOnCard: paymentInfo.nameOnCard.trim() === "" ? "Name on card is required" : "",
    };
    setPaymentErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  // Validate expiry date to ensure it's in the future
  const validateExpiryDate = (expiryDate) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      return false;
    }
    
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    // Convert YY to YYYY
    const fullYear = year + 2000;
    
    // Check if the card is expired
    if (fullYear < currentDate.getFullYear()) {
      return false;
    }
    
    // If same year, check month
    if (fullYear === currentDate.getFullYear() && month < currentMonth) {
      return false;
    }
    
    return true;
  };

  // Input formatting functions
  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || [];
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent numbers in text fields
    if (["fullName", "city", "country"].includes(name) && /\d/.test(value)) {
      return;
    }
    
    // Prevent letters in postal code
    if (name === "postalCode" && /[a-zA-Z]/.test(value)) {
      return;
    }
    
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number and expiry date
    if (name === "cardNumber") {
      const formattedValue = formatCardNumber(value);
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === "expiryDate") {
      const formattedValue = formatExpiryDate(value);
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === "cvv") {
      // Only allow numbers in CVV
      if (/[^0-9]/.test(value)) {
        return;
      }
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    } else if (name === "nameOnCard") {
      // Prevent numbers in name on card
      if (/\d/.test(value)) {
        return;
      }
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError("");
    
    try {
      // Process payment using mock function
      const paymentResult = await processPayment();
      
      if (paymentResult.success) {
        // Create order in backend
        const response = await api.post('/orders/place-order', {
          shippingAddress: shippingInfo,
          paymentMethod: "Credit Card",
          paymentIntentId: paymentResult.transactionId
        });

        const orderData = response.data;

        if (orderData.status === 'success') {
          setIsProcessing(false);
          setOrderComplete(true);
          clearCart();
          
          // Redirect to confirmation page after 2 seconds
          setTimeout(() => {
            navigate("/order-confirmation");
          }, 2000);
        } else {
          setPaymentError(orderData.message);
          setIsProcessing(false);
        }
      }
    } catch (error) {
      setPaymentError(error.message);
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    let isValid = false;
    
    if (activeStep === 0) {
      isValid = validateShipping();
    } else if (activeStep === 1) {
      isValid = validatePayment();
    } else {
      isValid = true;
    }
    
    if (isValid && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    if (activeStep === 0) {
      return shippingInfo.fullName.trim() !== "" && 
             shippingInfo.address.trim() !== "" && 
             shippingInfo.city.trim() !== "" && 
             shippingInfo.postalCode.trim() !== "" && 
             shippingInfo.country.trim() !== "";
    } else if (activeStep === 1) {
      return paymentInfo.cardNumber.replace(/\s/g, "").length === 16 && 
             validateExpiryDate(paymentInfo.expiryDate) && 
             paymentInfo.cvv.length >= 3 && 
             paymentInfo.nameOnCard.trim() !== "";
    }
    return true;
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl animate-pulse"></div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:40px_40px] z-0"></div>
        
        <div className="relative z-10 max-w-md w-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 animate-ping-slow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">Order Confirmed!</h2>
            <p className="text-gray-300 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="text-gray-400 mb-8">Redirecting to confirmation page...</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full animate-progress"></div>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex items-center px-4 py-2 bg-gray-700 rounded-full">
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 text-white bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
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

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-sm font-semibold text-white shadow-lg">
            CHECKOUT
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Complete Your Order
          </h1>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-12 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex justify-between mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  index === activeStep 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transform scale-110' 
                    : index < activeStep 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                      : 'bg-gray-700'
                }`}>
                  {index < activeStep ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : index + 1}
                </div>
                <span className={`mt-3 font-medium transition-colors duration-300 ${
                  index === activeStep 
                    ? 'text-blue-400' 
                    : index < activeStep 
                      ? 'text-green-400' 
                      : 'text-gray-500 group-hover:text-gray-400'
                }`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 animate-pulse-slow" 
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-500/10 blur-xl animate-pulse-slow pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold mb-6 relative z-10 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Order Summary
            </h2>
            
            <div className="space-y-6 mb-8 relative z-10">
              {cartItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-700/50 transition-all duration-300 hover:bg-gray-700/30 rounded-xl p-2 -mx-2">
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded-xl bg-gray-700/50 backdrop-blur-sm p-3 border border-gray-600/50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-gray-400">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-700">
                <span>Total</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Checkout Form */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-500/10 blur-xl animate-pulse-slow pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10">
              {/* Shipping Information */}
              {activeStep === 0 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Shipping Information
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block mb-2 text-gray-300">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {shippingErrors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{shippingErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {shippingErrors.address && (
                        <p className="text-red-400 text-sm mt-1">{shippingErrors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block mb-2 text-gray-300">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingChange}
                          className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        {shippingErrors.city && (
                          <p className="text-red-400 text-sm mt-1">{shippingErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-gray-300">Postal Code *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleShippingChange}
                          className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        {shippingErrors.postalCode && (
                          <p className="text-red-400 text-sm mt-1">{shippingErrors.postalCode}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300">Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {shippingErrors.country && (
                        <p className="text-red-400 text-sm mt-1">{shippingErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment Information */}
              {activeStep === 1 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    Payment Information
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block mb-2 text-gray-300">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {paymentErrors.cardNumber && (
                        <p className="text-red-400 text-sm mt-1">{paymentErrors.cardNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-300">Name on Card *</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={handlePaymentChange}
                        className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        required
                      />
                      {paymentErrors.nameOnCard && (
                        <p className="text-red-400 text-sm mt-1">{paymentErrors.nameOnCard}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block mb-2 text-gray-300">Expiry Date *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        {paymentErrors.expiryDate && (
                          <p className="text-red-400 text-sm mt-1">{paymentErrors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 text-gray-300">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="w-full p-4 bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        {paymentErrors.cvv && (
                          <p className="text-red-400 text-sm mt-1">{paymentErrors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Review Order */}
              {activeStep === 2 && (
                <div className="animate-fadeIn">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Review Your Order
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-gray-700/50 backdrop-blur-sm p-5 rounded-xl border border-gray-600/50">
                      <h3 className="font-bold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Shipping Address
                      </h3>
                      <p className="text-gray-300">{shippingInfo.fullName}</p>
                      <p className="text-gray-300">{shippingInfo.address}</p>
                      <p className="text-gray-300">{shippingInfo.city}, {shippingInfo.postalCode}</p>
                      <p className="text-gray-300">{shippingInfo.country}</p>
                    </div>
                    
                    <div className="bg-gray-700/50 backdrop-blur-sm p-5 rounded-xl border border-gray-600/50">
                      <h3 className="font-bold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        Payment Method
                      </h3>
                      <p className="text-gray-300">Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    </div>
                    
                    <div className="bg-gray-700/50 backdrop-blur-sm p-5 rounded-xl border border-gray-600/50">
                      <h3 className="font-bold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-gray-300">
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-600">
                        <span>Total:</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">${(totalPrice * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentError && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-sm border border-red-700/50 rounded-xl text-red-300 animate-fadeIn">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {paymentError}
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="mt-10 flex justify-between">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-700/50 backdrop-blur-sm rounded-xl font-bold hover:bg-gray-600/50 transition-all duration-300 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back
                  </button>
                )}
                
                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className={`ml-auto px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center ${
                      isStepValid()
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Continue
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`ml-auto px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-300 relative overflow-hidden flex items-center ${
                      isProcessing
                        ? "bg-gradient-to-r from-blue-700 to-indigo-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-blue-500/30"
                    }`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-400 opacity-50 blur-xl filter animate-pulse-slow"></span>
                    <span className="relative z-10">
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ${totalPrice.toFixed(2)}
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                )}
              </div>
              
              <div className="mt-6 text-sm text-gray-400 text-center bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl">
                This is a test payment system. No actual charges will be made.
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}