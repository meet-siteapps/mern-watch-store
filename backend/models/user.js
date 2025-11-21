const mongoose = require("mongoose");

// Explicitly define the schema without address field
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    }, 
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://banner2.cleanpng.com/20180411/aow/avf1rwckw.webp"
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    favourites: [{ 
      type: mongoose.Types.ObjectId,
      ref: "Product" 
    }],
 cart: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1'],
      }
    }
  ],
    orders: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Order" 
    }],
  },
  {
    timestamps: true,
    autoIndex: false
  }
);

userSchema.set('autoIndex', false);

const User = mongoose.model("user", userSchema);

// Add this code to drop the address index when the model is initialized
User.on('index', () => {
  // Drop the address index if it exists
  User.collection.dropIndex('address_1', (err, result) => {
    if (err) {
      console.log('Address index does not exist or could not be dropped:', err.message);
    } else {
      console.log('Successfully dropped address index:', result);
    }
  });
});

module.exports = User;