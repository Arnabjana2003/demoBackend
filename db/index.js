import mongoose from "mongoose";

const connectDb = async () => {
  console.log(process.env.MONGODB_URL);
  try {
    await mongoose.connect("mongodb+srv://arnabjana:arnab123@cluster0.vulpqzo.mongodb.net/youtube");
    console.log("MongoDB connected");
  } catch (err) {
    console.log("DB connection error::", err);
    throw err;
  }
};

export default connectDb;
