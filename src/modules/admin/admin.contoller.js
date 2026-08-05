import orderModel from "../../models/order.model.js";
import userModel from "../../models/user.models.js";
import storeModel from "../../models/store.model.js";
import productModel from "../../models/product.model.js";
import paymentModel from "../../models/payment.model.js";
import couponModel from "../../models/coupon.model.js";





import { orderIdParamSchema, updateOrderStatusSchema } from "../../validations/order.validation.js";
import { createNotification } from "../../services/notification.services.js";


export const updateOrderStatusByAdmin =async(req,res,next)=>{
    try {
        const validateOrderId= await orderIdParamSchema.safeParseAsync(req.params);

        if(!validateOrderId.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid Order Id"
            })
        };

        const {orderId}=validateOrderId.data;

        const orderStatusValidation=await updateOrderStatusSchema.safeParseAsync(req.body);

        if(!orderStatusValidation.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid order status"
            })
        };

        const {orderStatus} = orderStatusValidation.data;



        const order =await orderModel.findOne({
            _id:orderId
        });

        if(!order){
            return res.status(404).json({
                status:false,
                message:"Order not found"
            })
        };

        if(order.orderStatus==="cancelled"){
            return res.status(400).json({
                status:false,
                message:"order has been cancelled"
            })
        };

        order.orderStatus=orderStatus;

        // ADD THIS 👇 — notify the customer about status change
await createNotification({
    user: order.user,
    title: "Order status updated",
    message: `Your order #${order._id} is now ${orderStatus}.`,
    type: "order",
    relatedOrder: order._id,
});

        await order.save();

        return res.status(200).json({
            status:true,
            message:"Order status updated successfully",
            data:{
                order
            }
        })

    } catch (error) {
        next(error);
        
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const { role, isActive } = req.query;
        const filter = {};
        if (role) {
            filter.role = role;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }
        const users = await userModel
            .find(filter)
            .select("-password")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Users fetched successfully",
            data: {
                users
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            status: true,
            message: "User fetched successfully",
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

export const toggleUserAccount = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        user.isActive = ! user.isActive;
        await user.save();
        return res.status(200).json({
            status: true,
            message: `User account ${user.isActive ? "activated" : "deactivated"} successfully`,
            data: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getAllSuppliers = async (req, res, next) => {
    try {
        const suppliers = await userModel
            .find({ role: "supplier" })
            .select("-password")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Suppliers fetched successfully",
            data: {
                suppliers
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllStores = async (req, res, next) => {
    try {
        const stores = await storeModel
            .find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Stores fetched successfully",
            data: {
                stores
            }
        });
    } catch (error) {
        next(error);
    }
};

export const verifyStore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({
                status: false,
                message: "Action must be approve or reject"
            });
        }
        const store = await storeModel.findById(id);
        if (!store) {
            return res.status(404).json({
                status: false,
                message: "Store not found"
            });
        }

        // Set store verification status: true if action is "approve", otherwise false

        store.isVerified = action === "approve";
        await store.save();
        return res.status(200).json({
            status: true,
            message: `Store ${action === "approve" ? "approved" : "rejected"} successfully`,
            data: {
                store
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getAllProducts = async (req, res, next) => {
    try {
        const products = await productModel
            .find()  //It simply returns all documents in the products collection.
            .populate("supplier", "name email")
            .populate("store", "name")
            .populate("category", "name")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Products fetched successfully",
            data: {
                products
            }
        });
    } catch (error) {
        next(error);
    }
};



export const updateProductByAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }
        const allowedFields = ["title", "description", "price", "discountPrice", "stock", "brand", "isActive", "isFeatured"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });
        await product.save();
        return res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: {
                product
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductByAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                status: false,
                message: "Product not found"
            });
        }
        await product.deleteOne();
        return res.status(200).json({
            status: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const { status, date } = req.query;
        const filter = {};
        if (status) {
            filter.orderStatus = status;
        }
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);
            filter.createdAt = { $gte: start, $lt: end };
        }
        const orders = await orderModel
            .find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Orders fetched successfully",
            data: {
                orders
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPayments = async (req, res, next) => {
    try {
        const payments = await paymentModel
            .find()
            .populate("user", "name email")
            .populate("order", "total orderStatus")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Payments fetched successfully",
            data: {
                payments
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await couponModel
            .find()
            .sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Coupons fetched successfully",
            data: {
                coupons
            }
        });
    } catch (error) {
        next(error);
    }
};

export const createCoupon = async (req, res, next) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscountAmount,
            usageLimit,
            expiresAt
        } = req.body;
        const existingCoupon = await couponModel.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(409).json({
                status: false,
                message: "Coupon code already exists"
            });
        }
        const coupon = await couponModel.create({
            code,
            discountType,
            discountValue,
            minimumOrderAmount,
            maximumDiscountAmount,
            usageLimit,
            expiresAt
        });
        return res.status(201).json({
            status: true,
            message: "Coupon created successfully",
            data: {
                coupon
            }
        });
    } catch (error) {
        next(error);
    }
};


export const updateCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const coupon = await couponModel.findById(id);
        if (!coupon) {
            return res.status(404).json({
                status: false,
                message: "Coupon not found"
            });
        }
        const allowedFields = ["discountType", "discountValue", "minimumOrderAmount", "maximumDiscountAmount", "usageLimit", "expiresAt"];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                coupon[field] = req.body[field];
            }
        });
        await coupon.save();
        return res.status(200).json({
            status: true,
            message: "Coupon updated successfully",
            data: {
                coupon
            }
        });
    } catch (error) {
        next(error);
    }
};
