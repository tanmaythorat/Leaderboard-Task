// Import mongoose to handle MongoDB connections
const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    // Attempt to connect to MongoDB with the given URI
    await mongoose.connect(process.env.MONGO_URI);

    // Success message on successful connection
    console.log("MongoDB connected");
  } catch (err) {

    // Log the error and exit the process if connection fails
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in app.js or server.js
module.exports = connectDB;
