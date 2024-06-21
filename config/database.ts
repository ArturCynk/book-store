import mongoose from 'mongoose';

const connectDB = async (mongoURI?: string) => {
  try {
    if (!mongoURI) {
      throw new Error('MongoURI is not provided');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error(`Error connecting to MongoDB`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
