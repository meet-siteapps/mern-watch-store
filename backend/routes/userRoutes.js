  // routes/userRoutes.js
  const express = require('express');
  const router = express.Router();
  const User = require("../models/user");
  const bcrypt = require("bcryptjs");
  const jwt = require("jsonwebtoken");
  const { authenticateToken } = require("./userAuth");

// Sign-up route
router.post("/sign-up", async (req, res) => {
    try {
      console.log("Registration attempt:", req.body); // Add logging
      
      const { username, email, password } = req.body;
      
      // Validate inputs
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Validate username length
      if (username.length < 4) {
        return res
          .status(400)
          .json({ message: "Username must contain more than 3 characters" });
      }
      
      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res
          .status(400)
          .json({ message: "This username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "This email already exists" });
      }
      
      // Validate password length
      if (password.length <= 5) {
        return res
          .status(400)
          .json({ message: "Password must contain more than 5 characters" });
      }
      
      // Hash the password
      const hashPass = await bcrypt.hash(password, 10);
      
      // Create new user object
      const newUser = new User({
        username: username,
        email: email,
        password: hashPass,
      });
      
      // Save user to database
      const savedUser = await newUser.save();
      console.log("User saved successfully:", savedUser); // Add logging
      
      return res.status(200).json({ 
        message: "Sign-up successful",
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email
        }
      });
    } catch (error) {
      console.error("Registration error:", error); // Add logging
      res.status(500).json({ error: "Internal server error" });
    }
});

// sign-in route
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);
    
    if (isMatch) {
      // Create JWT token with correct payload structure
      const token = jwt.sign(
        { 
          id: existingUser._id.toString(), // Convert to string for JWT
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role 
        }, 
        process.env.JWT_SECRET || "shhhh", 
        { expiresIn: "30d" }
      );
      
      // Return complete user data without password
      const userWithoutPassword = existingUser.toObject();
      delete userWithoutPassword.password;
      
      console.log("User signed-in successfully");
      return res.status(200).json({
        ...userWithoutPassword,
        token
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    // Get user ID from the token (decoded in middleware)
    const userId = req.user.id;
    
    // Get user data and clean up invalid cart items
    const userData = await User.findById(userId).populate("cart.product");
    
    // Filter out items where product is null (deleted products)
    const validCartItems = userData.cart.filter(item => item.product);
    
    // If there were invalid items, update the user's cart
    if (validCartItems.length !== userData.cart.length) {
      await User.findByIdAndUpdate(userId, {
        $set: { cart: validCartItems }
      });
    }
    
    // Return user data without password
    const userWithoutPassword = userData.toObject();
    delete userWithoutPassword.password;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all users (admin only)
router.get("/users", authenticateToken, async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const data = await User.find().select("-password");
      console.log("User data fetched");
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
});

  module.exports = router;