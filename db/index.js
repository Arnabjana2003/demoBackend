import mongoose from "mongoose";

const connectDb = async () => {
  console.log(process.env.MONGODB_URL);
  try {
    await mongoose.connect(String(process.env.MONGODB_URL));
    console.log("MongoDB connected");
  } catch (err) {
    console.log("DB connection error::", err);
    throw err;
  }
};

export default connectDb;
