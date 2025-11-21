// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

// Place order with simplified payment
// routes/orderRoutes.js
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        // Fix: Get user ID from req.user instead of req.headers
        const userId = req.user.id;
        const { 
            shippingAddress, 
            paymentMethod, 
            paymentIntentId,
            billingAddress
        } = req.body;
        
        // Validate required fields
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ 
                status: "error",
                message: "Shipping address and payment method are required" 
            });
        }
        
        // Get user's cart with populated product details
        const userData = await User.findById(userId).populate("cart.product");
        
        if (!userData.cart || userData.cart.length === 0) {
            return res.status(400).json({ 
                status: "error",
                message: "Your cart is empty" 
            });
        }
        
        // Calculate prices and prepare order items
        let itemsPrice = 0;
        const orderItems = [];
        
        for (const cartItem of userData.cart) {
            const product = cartItem.product;
            if (!product) {
                return res.status(404).json({ 
                    status: "error", 
                    message: `Product not found in cart` 
                });
            }
            
            // Check if product is in stock
            if (!product.inStock) {
                return res.status(400).json({ 
                    status: "error", 
                    message: `${product.name} is out of stock` 
                });
            }
            
            const itemTotal = product.price * cartItem.quantity;
            itemsPrice += itemTotal;
            
            orderItems.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.price
            });
        }
        
        // Calculate additional prices
        const taxPrice = itemsPrice * 0.1; // 10% tax
        const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
        const totalPrice = itemsPrice + taxPrice + shippingPrice;
        
        // For credit card payments, mark as paid
        let isPaid = false;
        let paidAt = null;
        let paymentResult = null;
        
        if (paymentMethod === "Credit Card" || paymentMethod === "PayPal") {
            isPaid = true;
            paidAt = new Date();
            paymentResult = {
                id: paymentIntentId || `mock_payment_${Date.now()}`,
                status: "succeeded",
                update_time: new Date().toISOString(),
                email_address: userData.email
            };
        }
        
        // Create new order
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            isPaid,
            paidAt,
            paymentResult
        });
        
        const savedOrder = await newOrder.save();
        
        // Save order in user model
        await User.findByIdAndUpdate(userId, {
            $push: { orders: savedOrder._id }
        });
        
        // Clear user's cart
        await User.findByIdAndUpdate(userId, {
            $set: { cart: [] }
        });
        
        return res.json({
            status: "success",
            message: "Order placed successfully",
            data: savedOrder
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Get order history
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        // Fix: Get user ID from req.user instead of req.headers
        const userId = req.user.id;
        const userData = await User.findById(userId).populate({
            path: "orders", 
            populate: { path: "items.product", model: Product },
        });
        const orderData = userData.orders.reverse();
        return res.json({
            status: "success",
            data: orderData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Get all orders - admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                status: "error",
                message: "Access denied" 
            });
        }
        
        const orderData = await Order.find()
        .populate({
            path: "items.product",
        })
        .populate({
            path: "user",
        })
        .sort({ createdAt: -1 });
        
        return res.json({
            status: "success",
            data: orderData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Update order status - admin
router.put("/update-status/:id", authenticateToken, async(req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                status: "error",
                message: "Access denied" 
            });
        }
        
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { status },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ 
                status: "error",
                message: "Order not found" 
            });
        }
        
        return res.json({
            status: "success",
            message: "Status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

// Get order by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const order = await Order.findById(id)
            .populate({
                path: "items.product",
            })
            .populate({
                path: "user",
            });
        
        if (!order) {
            return res.status(404).json({ 
                status: "error",
                message: "Order not found" 
            });
        }
        
        // Check if user is admin or the order belongs to the user
        if (req.user.role !== 'admin' && order.user._id.toString() !== userId) {
            return res.status(403).json({ 
                status: "error",
                message: "Access denied" 
            });
        }
        
        return res.json({
            status: "success",
            data: order
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            status: "error",
            message: "Internal server error" 
        });
    }
});

module.exports = router;