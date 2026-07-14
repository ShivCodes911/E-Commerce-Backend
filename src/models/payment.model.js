import mongoose from "mongoose";


const paymentSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    order:{type:mongoose.Schema.Types.ObjectId,ref:"Order",required:true},
    razorpayOrderId:{type:String,required:true},
    razorpayPaymentId:{type:String,default:null},
    razorpaySignature:{type:String,default:null},
    amount:{type:Number,required:true,min:0},
    currency:{type:String,default:"INR"},
    status:{type:String,enum:["created","success","failed","refunded"],default:"created"},
    paidAt:{type:Date,default:null}
},{
    timestamps:true
});


const paymentModel = mongoose.model("Payment",paymentSchema);

export default paymentModel;