import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    name:{type:String,required:[true,"Name is Required"]},
    email:{type:String,required:[true,"Email is required"],unique:true,lowercase:true,trim:true},
    password:{type:String,required:[true,"Password is required"]},
    role:{type:String,enum:["customer","supplier","admin"],default:"customer"},
    phone:{type:String,required:[true,"Enter you Phone Number"]},
    avatar:{
        url:{type:String,default:""},
        publicId:{type:String,default:""}
    },
    isEmailVerified:{type:Boolean,default:false},
    addresses: [
      {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String,
        country: {
          type: String,
          default: "India",
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive:{type:Boolean,default:true},

});
const userModel = mongoose.model("User",userSchema);

export default userModel;