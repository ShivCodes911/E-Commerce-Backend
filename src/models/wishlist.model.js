import mongoose from "mongoose";

const wishListSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,unique:true},
    products:{type:[
        {
            product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        addedAt:{
            type:Date,
            default:Date.now
        },
    }],
default:[]}
},{
    timestamps:true
});

const wishListModel=mongoose.model("WishList",wishListSchema);

export default wishListModel;