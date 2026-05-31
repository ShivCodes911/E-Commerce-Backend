import mongoose from "mongoose";


const categorySchema= new mongoose.Schema({
    name:{type:String,trim:true,unique:true,required:true,},
    slug:{type:String,required:true,lowercase:true,unique:true,trim:true,},
    description:{type:String,default:""},
    image:{
        url:{type:String,default:""},
        publicId:{type:String,default:""}
    },
    isActive:{type:Boolean,default:true}
},{
    timestamps:true
})


const categoryModel=mongoose.model("Category",categorySchema);

export default categoryModel;