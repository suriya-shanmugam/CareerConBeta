const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI; // Fetch the MongoDB URI from the environment variables

  if (!mongoURI) {
    console.error("MongoDB URI is not defined in environment variables");
    process.exit(1); // Exit if the URI is not defined
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if the connection fails
  }
};

module.exports = connectDB;
