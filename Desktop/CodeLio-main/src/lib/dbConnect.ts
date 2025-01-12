import mongoose from "mongoose";

// Connection state tracking object
const connection: ConnectionObject = { isConnected: 0 };

export async function dbConnect(): Promise<void> {
  // Check if the connection is already established
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to database");
    return;
  }

  try {
    // Connecting to MongoDB using the provided connection string
    await mongoose.connect("mongodb://localhost:27017/pretest");

    const dbConnection = mongoose.connection;

    // Event listener when MongoDB connection is successful
    dbConnection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    // Event listener for MongoDB connection error
    dbConnection.on("error", (err) => {
      console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
      process.exit(1); // Exit the process on connection error
    });

  } catch (error) {
    console.log("Something went wrong during MongoDB connection!");
    console.error(error);
  }
}

// Define ConnectionObject type to track connection state
type ConnectionObject = {
  isConnected?: number; // Optional, used for custom connection state tracking
};