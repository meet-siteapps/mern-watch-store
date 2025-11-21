// src/context/FavoritesContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch favorites when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchFavorites();
    }
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get('/favorites/get-favorites');
      if (response.data.status === "success") {
        setFavorites(response.data.data || []);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    setLoading(true);
    try {
      const response = await api.put('/favorites/add-favorite', {}, {
        headers: { watchid: productId.toString() }
      });
      
      if (response.status === 200) {
        await fetchFavorites();
        return true;
      } else {
        setError('Failed to add to favorites');
        return false;
      }
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.response?.data?.message || 'Failed to add to favorites');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId) => {
    setLoading(true);
    try {
      console.log('Removing from favorites:', productId);
      const response = await api.put('/favorites/remove-favorite', {}, {
        headers: { watchid: productId.toString() }
      });
      
      console.log('Remove favorites response:', response);
      
      if (response.status === 200) {
        await fetchFavorites();
        return true;
      } else {
        setError('Failed to remove from favorites');
        return false;
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.response?.data?.message || 'Failed to remove from favorites');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isInFavorites = (productId) => {
    return favorites.some(fav => fav._id === productId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      error,
      addToFavorites,
      removeFromFavorites,
      fetchFavorites,
      isInFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};