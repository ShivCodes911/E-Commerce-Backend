import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: ["order", "payment", "coupon", "review", "system"],
            required: true
        },

        isRead: {
            type: Boolean,
            default: false
        },

        relatedOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },

        relatedProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null
        }
    },
    {
        timestamps: true
    }
);

const notificationModel = mongoose.model(
    "Notification",
    notificationSchema
);

export default notificationModel;