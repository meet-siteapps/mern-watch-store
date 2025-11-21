const express = require("express");
const app = express();
const db = require("./db/db");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

// Get frontend URLs from environment variables
const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PROD
].filter(Boolean); // Remove any undefined values

// More permissive CORS configuration for development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Add 'watchid' to the allowed headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'watchid'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

//models
const Book = require("./models/product"); // Note: This should be named Product for clarity
const user = require("./models/user");

// routes
const userRoutes = require("./routes/userRoutes");
const watchRoutes = require("./routes/watchRoutes");
const favoriteRoutes = require("./routes/favorites"); // Updated route file
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes"); // Add this line



app.use(bodyParser.json());

// Add this for preflight requests
app.options('*', cors());

app.get("/", (req, res) => { 
  res.send("Hey, Developer Welcome to LuxWatch"); 
});

// Route configuration
app.use("/", userRoutes);
app.use("/watches", watchRoutes);
app.use("/favorites", favoriteRoutes); // Updated route path
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes); // Add this line
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Define PORT before using it
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
  console.log("CORS enabled for origins:", allowedOrigins);
});