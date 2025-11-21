const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Luxury", "Sports", "Smart", "Vintage", "Casual"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Export this model
module.exports = mongoose.model("Product", productSchema);