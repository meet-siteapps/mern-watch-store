// src/App.jsx
import { useState } from "react"; // Import useState from react
import { Routes, Route } from "react-router-dom"; // Remove useState from react-router-dom
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Footer from "./components/Footer.jsx";
import WelcomeBanner from "./components/WelcomeBanner";

function App() {
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [welcomeUserData, setWelcomeUserData] = useState(null);

  const handleLoginSuccess = (userData) => {
    setWelcomeUserData(userData);
    setShowWelcomeBanner(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowWelcomeBanner(false);
    }, 5000);
  };

  const handleCloseWelcomeBanner = () => {
    setShowWelcomeBanner(false);
  };

  return (
    <UserProvider>
      <FavoritesProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {/* Welcome Banner */}
            {showWelcomeBanner && (
              <WelcomeBanner 
                user={welcomeUserData} 
                onClose={handleCloseWelcomeBanner} 
              />
            )}
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes (require authentication) */}
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </UserProvider>
  );
}

export default App;