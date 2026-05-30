import mongoose from "mongoose";


const storeSchema=new mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:[true,"Owner of the store is Required"],unique:true},
    name:{type:String,required:true,trim:true,unique:true},
    slug:{type:String,required:true,unique:true,lowercase:true},
    description:{type:String,default:""},
    logo:{
        url:{type:String,default:""},
        publicId:{type:String,default:""},

    },
    isVerified:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true}
},{
    timestamps:true
})

const storeModel=mongoose.model("Store",storeSchema);

export default storeModel;