// server/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads environment variables from .env file

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for our React app
app.use(cors({
    origin: process.env.CLIENT_URL 
}));

// Allow the app to parse JSON from request bodies
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
// Import the routes from our routes/api.js file
const apiRoutes = require('./routes/api');
// Tell the app to use these routes and prefix them with /api
app.use('/api', apiRoutes);

// --- Start the Server ---
// Make the server listen on the specified port
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});