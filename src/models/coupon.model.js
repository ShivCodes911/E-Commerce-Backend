import mongoose from "mongoose";


const couponSchema= new mongoose.Schema({
    code:{type:String,unique:true,uppercase:true,trim:true,required:true},
    discountType:{type:String,enum:["percentage","fixed"],required:true},
    discountValue:{type:Number,required:true,min:1},
    minimumOrderAmount:{type:Number,default:0,min:0},
    maximumDiscountAmount:{type:Number,default:0,min:0},
    usageLimit:{type:Number,required:true,min:1},
    usedCount:{type:Number,min:0,default:0},
    expiresAt:{type:Date,required:true},
    isActive:{type:Boolean,default:true}
},{
    timestamps:true
});


const couponModel=mongoose.model("Coupon",couponSchema);

export default couponModel;