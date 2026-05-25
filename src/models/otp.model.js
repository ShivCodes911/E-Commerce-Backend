import mongoose from "mongoose";




const otpSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:[true,"User is required"]},
    email:{type:String,required:[true,"Email is required"],lowercase:true,trim:true},
    hashOtp:{type:String,required:[true,"Otp is required "]},
    purpose:{type:String,enum:["email_verification","otp_login","forgot_password"],required:true},
    isUsed:{type:Boolean,default:false},
    expireAt:{type:Date,required:true},
    attempts:{type:Number,default:0},
},{
    timestamps:true
});

const otpModel=mongoose.model("Otp",otpSchema);

export default otpModel;