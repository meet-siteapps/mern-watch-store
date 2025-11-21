// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user on mount and whenever localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);
        } catch (error) {
          console.error("Error parsing user data:", error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    // Initial check
    checkAuth();
    
    // Listen for storage events to update state when localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login function
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Force a re-render of components that depend on authentication state
    window.dispatchEvent(new Event('storage'));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/admin/login');
    
    // Force a re-render of components that depend on authentication state
    window.dispatchEvent(new Event('storage'));
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedUserData };
      localStorage.setItem('userData', JSON.stringify(newUser));
      return newUser;
    });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  // Check if user has admin role
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Get authentication token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Value object to be provided to consumers
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    getToken
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Higher-order component for protected routes (deprecated in favor of ProtectedRoute component)
export const withAuth = (Component) => {
  return function ProtectedRoute(props) {
    const { isAuthenticated, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated()) {
        navigate('/admin/login');
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };
};

// Higher-order component for admin-only routes (deprecated in favor of AdminProtectedRoute component)
export const withAdminAuth = (Component) => {
  return function AdminRoute(props) {
    const { isAuthenticated, isAdmin, loading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated()) {
          navigate('/admin/login');
        } else if (!isAdmin()) {
          navigate('/'); // or unauthorized page
        }
      }
    }, [isAuthenticated, isAdmin, loading, navigate]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      );
    }

    return isAuthenticated && isAdmin() ? <Component {...props} /> : null;
  };
};