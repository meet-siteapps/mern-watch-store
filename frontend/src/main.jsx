  // src/index.js
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App.jsx";
  import { CartProvider } from "./context/CartContext.jsx";
  import { FavoritesProvider } from "./context/FavoritesContext.jsx";
  import { UserProvider } from "./context/UserContext.jsx"; // Add this import
  import "./index.css";

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );