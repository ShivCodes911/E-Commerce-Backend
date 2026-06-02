import mongoose from "mongoose";


const productSchema=new mongoose.Schema({
    title:{type:String,required:true,trim:true},
    slug:{type:String,required:true,unique:true,lowercase:true,trim:true},
    description:{type:String,default:""},
    brand:{type:String,required:true,trim:true},
    price:{type:Number,required:true,min:0},
    discountPrice:{type:Number,default:null,min:0},
    stock:{type:Number,required:true,min:0},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"Category",required:true},
    supplier:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    store:{type:mongoose.Schema.Types.ObjectId,ref:"Store",required:true},
    images:[
        {
            url:{type:String,default:""},
            publicId:{type:String,default:""}
        }
    ],
    specifications:[
        {
            key:{type:String,trim:true},
            value:{type:String,trim:true}
        }
    ],
    ratingAverage:{type:Number,default:0,min:0,max:5},
    ratingCount: { type: Number, default: 0, min: 0 },
    isActive:{type:Boolean,default:true},
    isFeatured:{type:Boolean,default:false}
},{
    timestamps:true
});

const productModel=mongoose.model("Product",productSchema);

export default productModel;