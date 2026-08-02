import orderModel from "../../models/order.model.js";
import userModel from "../../models/user.models.js";


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



