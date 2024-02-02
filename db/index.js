import mongoose from "mongoose";

const connectDb = async () => {
  console.log(process.env.MONGODB_URL);
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/firstDb`);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("DB connection error::", err);
    throw err;
  }
};

export default connectDb;
