// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import Home from "./pages/admin/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// admin panel
import AdminDashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminProductDetail from "./pages/admin/ProductDetail";
import AdminLogin from "./pages/admin/Login.jsx";
import AdminProfile from "./pages/admin/Profile";
import SiteConfig from './pages/admin/SiteConfig';
import AdminProducts from './pages/admin/AdminProducts';





function App() {
  return (
    <UserProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>              

            {/* admin */}
            <Route path="/" element={<Home />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products/add" element={<AddProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/products/edit/:id" element={<AdminProductDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/settings/profile" element={<AdminProfile />} />
            <Route path="/admin/site-config" element={<SiteConfig />} />
            <Route path="/admin/products" element={<AdminProducts />} />

            </Routes>
          </main>
          <Footer />
        </div>
    </UserProvider>
  );
}

export default App;