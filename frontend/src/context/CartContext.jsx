// src/context/CartContext.jsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import api from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCartItems();
    }
  }, []);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      const response = await api.get('/cart/get-user-cart');
      if (response.data.status === "success") {
        // Filter out items where product is undefined (deleted products)
        const validCartItems = response.data.data.filter(item => item.product);
        
        // Transform backend data to match frontend needs
        const transformedItems = validCartItems.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          url: item.product.url,
          brand: item.product.brand,
          category: item.product.category,
          description: item.product.description,
          inStock: item.product.inStock,
          features: item.product.features || [],
          quantity: item.quantity // Use the quantity from backend
        }));
        setCartItems(transformedItems);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (item) => {
    // First, update the backend
    try {
      const response = await api.put('/cart/add-to-cart', {}, {
        headers: { watchid: item.id.toString() }
      });
      
      if (response.data.status === "success") {
        // Then update the frontend state
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
          
          if (existingItem) {
            return prevItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                : cartItem
            );
          } else {
            return [...prevItems, { ...item, quantity: item.quantity || 1 }];
          }
        });
        
        return true;
      } else {
        console.error('Backend error:', response.data.message);
        return false;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

 // src/context/CartContext.jsx

const removeFromCart = async (id) => {
  try {
    console.log('Removing from cart:', id);
    
    // Remove from backend
    const response = await api.put(`/cart/remove-from-cart/${id}`);
    
    console.log('Remove from cart response:', response.data);
    
    if (response.data.status === "success") {
      // Update frontend state
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
      return true;
    } else {
      console.error('Backend error:', response.data.message);
      return false;
    }
  } catch (err) {
    console.error('Error removing from cart:', err);
    if (err.response) {
      console.error('Error response:', err.response.data);
    }
    return false;
  }
};

  const updateQuantity = async (id, quantity) => {
    if (!quantity || quantity < 1) return false;
    
    try {
      // Update backend
      const response = await api.put(`/cart/update-quantity/${id}`, { quantity });
      
      if (response.data.status === "success") {
        // Update frontend state
        setCartItems(
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
        return true;
      } else {
        console.error('Backend error:', response.data.message);
        return false;
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      // Clear frontend state
      setCartItems([]);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};