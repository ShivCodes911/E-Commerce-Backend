import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    order:{type:mongoose.Schema.Types.ObjectId,ref:"Order",required:true},
    rating:{type:Number,required:true,min:1,max:5},
    comment:{type:String,required:true,trim:true},
    images:[{
        url:{type:String,default:""},
        publicId:{type:String,default:""},
    }],

    isVerifiedPurchase:{    
        type:Boolean,
        default:true
    }
},{
    timestamps:true
});


const reviewModel= mongoose.model("Review",reviewSchema);

export default reviewModel;
