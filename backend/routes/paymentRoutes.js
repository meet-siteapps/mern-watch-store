// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");

// Mock payment intent creation
router.post("/create-payment-intent", authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                status: "error",
                message: "Invalid amount" 
            });
        }
        
        // Generate a mock payment intent ID
        const paymentIntentId = `mock_pi_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Return mock client secret
        res.send({
            clientSecret: `mock_cs_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            paymentIntentId: paymentIntentId
        });
    } catch (error) {
        console.error("Error creating mock payment intent:", error);
        res.status(500).json({ 
            status: "error",
            message: error.message 
        });
    }
});

// Mock payment verification (always successful)
router.post("/verify-payment", authenticateToken, async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        
        if (!paymentIntentId) {
            return res.status(400).json({ 
                status: "error",
                message: "Payment intent ID is required" 
            });
        }
        
        // Always return success for mock payment
        return res.status(200).json({
            status: "success",
            message: "Payment verified successfully",
            paymentIntent: {
                id: paymentIntentId,
                status: "succeeded",
                amount: req.body.amount || 0,
                currency: "usd",
                created: Date.now()
            }
        });
    } catch (error) {
        console.error("Error verifying mock payment:", error);
        res.status(500).json({ 
            status: "error",
            message: error.message 
        });
    }
});

module.exports = router;