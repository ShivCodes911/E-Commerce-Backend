import mongoose from "mongoose";


const connectDB=async ()=>{
    try {
        const connectionInstance=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is connected Successfully ✅:db host:${connectionInstance.connection.host}`);
} catch (error) {
        console.error("Failed to Connect DB",error);
        process.exit(1);
        
    }
}
export default connectDB;

