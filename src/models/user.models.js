import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{type:String,required:[true,"Name is Required"]},
    email:{type:String,required:[true,"Email is required"]},
    password:{type:String,required:[true,"Password is required"]},
    role:{type:String,enum:["customer","supplier","admin"],default:"customer"},
    phone:{type:String,required:[true,"Enter you Phone Number"]},
    avatar:{
        url:{type:String,default:""},
        publicId:{type:String,default:""}
    },
    isEmailVerified:{type:Boolean,default:false},
    address:{type:Array,required:[true,"Address is required"]},
    isActive:{type:Boolean,default:true},

});