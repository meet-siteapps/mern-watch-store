import axios from 'axios';

const api = axios.create({
baseURL: 'https://mern-watch-store.onrender.com',
// baseURL: 'http://localhost:5173/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response;
      
      // Handle business logic errors (like out of stock)
      if (data?.status === 'error' && data?.message) {
        console.error('Business Logic Error:', {
          url: config.url,
          message: data.message
        });
        return Promise.reject({
          ...error,
          customMessage: data.message
        });
      }

      switch (status) {
        case 401:
          // Only logout if it's specifically an authentication error
          // Check if the error message indicates token expiration
          if (data.message === "Token Expired, Sign-in your account again" || 
              data.message === "Authentication token required") {
            console.log('Authentication error, logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            // Dispatch a custom event instead of directly redirecting
            window.dispatchEvent(new CustomEvent('authError'));
          }
          break;
        case 403:
          console.error('Forbidden access:', data);
          break;
        case 404:
          console.error('Resource not found:', config.url);
          break;
        case 422:  // Validation error
          console.error('Validation Error:', data);
          break;
        default:
          console.error(`API Error [${status}]:`, {
            url: config.url,
            method: config.method,
            data: data
          });
      }
    } else if (error.request) {
      console.error('Network Error:', {
        message: error.message,
        config: error.config
      });
    } else {
      console.error('Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;