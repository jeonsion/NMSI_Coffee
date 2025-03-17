import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
    }
};

export default connectDB;
