import mongoose from "mongoose";

const  orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
        supplier:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
        store:{type:mongoose.Schema.Types.ObjectId,ref:"Store",required:true},
        title:{type:String,required:true},
        image:{type:String,default:null},
        quantity:{type:Number,required:true,min:1},
        priceAtPurchase:{type:Number,required:true,min:0},
        totalPrice:{type:Number,required:true,min:0}
    }],

    shippingAddress: {
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    addressLine1: {
        type: String,
        required: true,
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        default: "India"
    }

    },

        coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },

       subtotal: {
        type: Number,
        required: true,
        min: 0
    },

       discount: {
        type: Number,
        default: 0,
        min: 0
    },

       total: {
        type: Number,
        required: true,
        min: 0
    },

        orderStatus: {
        type: String,
        enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },


    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },

       cancelledAt: {
        type: Date,
        default: null
    },
      cancelReason: {
        type: String,
        default: null
    }


},{
    timestamps:true
});

const orderModel=mongoose.model("Order",orderSchema);

export default orderModel;