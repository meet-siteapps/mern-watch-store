// src/context/UserContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api'; // Import the api instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        
        // Verify token is still valid by fetching fresh user data
        fetchUserInfo();
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // Fetch user information from API
  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/get-user-information');
      
      // Update user state with fresh data
      setUser(response.data);
      
      // Update localStorage with fresh data
      localStorage.setItem('userData', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching user info:', err);
      // If token is invalid, clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/sign-in', {
        username,
        password
      });
      
      const { token, ...userData } = response.data;
      
      // Save token and user data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Set user state
      setUser(userData);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/sign-up', {
        username: name,
        email,
        password
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, loading, error, fetchUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};