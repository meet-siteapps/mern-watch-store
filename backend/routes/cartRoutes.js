// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");

// Add to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
    try {
        const { watchid } = req.headers;
        const userId = req.user.id;
        
        if (!watchid) {
            return res.status(400).json({
                status: "error",
                message: "Product ID is required"
            });
        }
        
        const userData = await User.findById(userId);
        
        // Check if the product is already in the cart
        const cartItemIndex = userData.cart.findIndex(
            item => item.product && item.product.toString() === watchid
        );
        
        if (cartItemIndex !== -1) {
            // Product already in cart, increment quantity
            userData.cart[cartItemIndex].quantity += 1;
            await userData.save();
            
            return res.status(200).json({
                status: "success",
                message: "Quantity updated in cart",
                quantity: userData.cart[cartItemIndex].quantity
            });
        } else {
            // Product not in cart, add it
            userData.cart.push({
                product: watchid,
                quantity: 1
            });
            await userData.save();
            
            return res.status(200).json({
                status: "success",
                message: "Watch added to your cart"
            });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Remove from cart
router.put("/remove-from-cart/:watchid", authenticateToken, async (req, res) => {
    try {
        const { watchid } = req.params;
        const userId = req.user.id;
        
        const userData = await User.findById(userId);
        
        // Find the cart item
        const cartItemIndex = userData.cart.findIndex(
            item => item.product && item.product.toString() === watchid
        );
        
        if (cartItemIndex !== -1) {
            if (userData.cart[cartItemIndex].quantity > 1) {
                // Decrement quantity if more than 1
                userData.cart[cartItemIndex].quantity -= 1;
                await userData.save();
                
                return res.status(200).json({
                    status: "success",
                    message: "Quantity decreased in cart",
                    quantity: userData.cart[cartItemIndex].quantity
                });
            } else {
                // Remove item if quantity is 1
                userData.cart.splice(cartItemIndex, 1);
                await userData.save();
                
                return res.status(200).json({
                    status: "success",
                    message: "Watch removed from cart"
                });
            }
        } else {
            return res.status(404).json({
                status: "error",
                message: "Item not found in cart"
            });
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Get user cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userData = await User.findById(userId).populate("cart.product");
        
        // Filter out items where product is null (deleted products)
        const validCartItems = userData.cart.filter(item => item.product);
        
        // If there were invalid items, update the user's cart
        if (validCartItems.length !== userData.cart.length) {
            await User.findByIdAndUpdate(userId, {
                $set: { cart: validCartItems }
            });
        }
        
        return res.status(200).json({
            status: "success",
            data: validCartItems.reverse()
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Update cart item quantity
router.put("/update-quantity/:watchid", authenticateToken, async (req, res) => {
    try {
        const { watchid } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: "error",
                message: "Quantity must be at least 1"
            });
        }
        
        const userData = await User.findById(userId);
        
        // Find the cart item
        const cartItemIndex = userData.cart.findIndex(
            item => item.product && item.product.toString() === watchid
        );
        
        if (cartItemIndex !== -1) {
            userData.cart[cartItemIndex].quantity = quantity;
            await userData.save();
            
            return res.status(200).json({
                status: "success",
                message: "Quantity updated",
                quantity: userData.cart[cartItemIndex].quantity
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Item not found in cart"
            });
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

module.exports = router;