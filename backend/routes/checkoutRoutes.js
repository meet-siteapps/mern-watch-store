// routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");

// Get checkout summary
router.get("/summary", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const userData = await User.findById(userId).populate("cart.product");
        
        if (!userData.cart || userData.cart.length === 0) {
            return res.status(400).json({ 
                status: "error",
                message: "Your cart is empty" 
            });
        }
        
        // Filter out items where product is null (deleted products)
        const validCartItems = userData.cart.filter(item => item.product);
        
        // Calculate prices
        let itemsPrice = 0;
        const checkoutItems = [];
        
        for (const cartItem of validCartItems) {
            const product = cartItem.product;
            const itemTotal = product.price * cartItem.quantity;
            itemsPrice += itemTotal;
            
            checkoutItems.push({
                product: {
                    _id: product._id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    url: product.url
                },
                quantity: cartItem.quantity,
                totalPrice: itemTotal
            });
        }
        
        // Calculate additional prices
        const taxPrice = itemsPrice * 0.1; // 10% tax
        const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        
        return res.status(200).json({
            status: "success",
            data: {
                items: checkoutItems,
                prices: {
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice
                }
            }
        });
    } catch (error) {
        console.error("Error fetching checkout summary:", error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

module.exports = router;