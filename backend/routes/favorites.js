// routes/favorites.js
const express = require("express");
const router = express.Router(); 
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add watch to favorites
router.put("/add-favorite", authenticateToken, async (req, res) => {
    try {
        const { watchid } = req.headers;
        const userId = req.user.id; // Get user ID from the authenticated token
        
        // Check if watch is already in favorites
        const userData = await User.findById(userId);
        const isFavorite = userData.favourites.includes(watchid);
        
        if (isFavorite) {
            return res.status(200).json({ message: "Watch already in favorites" });
        }
        
        // Add to favorites
        await User.findByIdAndUpdate(userId, { $push: { favourites: watchid } });
        return res.status(200).json({ message: "Watch added to favorites" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Remove watch from favorites
router.put("/remove-favorite", authenticateToken, async (req, res) => {
    try {
        const { watchid } = req.headers;
        const userId = req.user.id; // Get user ID from the authenticated token
        
        // Remove from favorites
        await User.findByIdAndUpdate(userId, { $pull: { favourites: watchid } });
        return res.status(200).json({ message: "Watch removed from favorites" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all favorite watches
router.get("/get-favorites", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authenticated token
        
        // Get user with populated favorites
        const userData = await User.findById(userId).populate("favourites");
        const favoriteWatches = userData.favourites;
        
        return res.json({
            status: "success",
            data: favoriteWatches,   
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}) 

module.exports = router;