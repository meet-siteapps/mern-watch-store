const router = require("express").Router();
const Product = require("../models/product"); // Using your Product model for watches
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
const mongoose = require("mongoose"); // ADD THIS LINE



// Add product - admin
router.post("/add-product", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to add products" });
    }
    
    const product = new Product({
      url: req.body.url,
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      description: req.body.description,
      features: req.body.features,
      category: req.body.category,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true
    });
    
    await product.save();
    console.log("New Product Saved");
    
    res.status(201).json({ 
      message: "New Product Saved",
      productId: product._id
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update the product - admin
router.put("/update-product/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update products" });
    }
    
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }
    
    // Build update object with only provided fields
    const updateFields = {};
    if (req.body.url !== undefined) updateFields.url = req.body.url;
    if (req.body.name !== undefined) updateFields.name = req.body.name;
    if (req.body.brand !== undefined) updateFields.brand = req.body.brand;
    if (req.body.price !== undefined) updateFields.price = req.body.price;
    if (req.body.description !== undefined) updateFields.description = req.body.description;
    if (req.body.features !== undefined) updateFields.features = req.body.features;
    if (req.body.category !== undefined) updateFields.category = req.body.category;
    if (req.body.inStock !== undefined) updateFields.inStock = req.body.inStock;
    
    // Check if there's anything to update
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    
    // Validate category if provided
    if (updateFields.category && !["Luxury", "Sports", "Smart", "Vintage", "Casual"].includes(updateFields.category)) {
      return res.status(400).json({ 
        message: "Invalid category. Must be one of: Luxury, Sports, Smart, Vintage, Casual" 
      });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateFields,
      { new: true, runValidators: true } // Return updated document and run schema validators
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json({ 
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    console.log(error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: "Validation error", errors: messages });
    }
    
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete the product - admin
router.delete("/delete-product/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete products" });
    }
    
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json({ 
      message: "Product Deleted",
      product: deletedProduct
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all products
router.get("/get-all-products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get recent products    
router.get("/get-recent-products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);
    return res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get in-stock products - MOVED UP
router.get("/in-stock", async (req, res) => {
  try {
    const products = await Product.find({ inStock: true });
    return res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    return res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get products by brand
router.get("/brand/:brand", async (req, res) => {
  try {
    const { brand } = req.params;
    const products = await Product.find({ brand: brand });
    return res.status(200).json({
      status: "Success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get product details by ID - This matches the frontend request    done
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;