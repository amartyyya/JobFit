import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('mongodb://localhost:27017/pretest');
}

export async function dbConnect() {
  try {
    const opts = {
      bufferCommands: false,
    };

    await mongoose.connect("mongodb://localhost:27017/pretest", opts);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

