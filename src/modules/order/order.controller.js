import orderModel from "../../models/order.model.js";
import cartModel from "../../models/cart.model.js";


import { checkoutOrderSchema ,orderIdParamSchema ,cancelOrderSchema} from "../../validations/order.validation.js";



export const checkoutOrder=async(req,res,next)=>{
    try {
        const validationResult= await checkoutOrderSchema.safeParseAsync(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid checkoutDetails"
            })
        }

        const { shippingAddress } = validationResult.data;

        const userId =req.user?.id;

        if(!userId){
            return  res.status(400).json({
                status:false,
                message:"User is not atuhenticated"
            });
        };


        const customersCart = await cartModel.findOne({
    user: userId
}).populate([
    {
        path: "items.product",
        select: "title images stock isActive supplier store"
    },
    {
        path: "coupon",
        select: "code discountType discountValue usedCount usageLimit isActive expiresAt"
    }
]);

        if(!customersCart){
            return res.status(400).json({
                status:false,
                message:"cart not found"
            })
        }

        if(customersCart.items.length===0){
            return res.status(400).json({
                status:false,
                message:"Cart us empty"
            })
        }

       for(const item of customersCart.items){
        const product = item.product;

        if(!product){
            return res.status(400).json({
                status:false,
                message:"Product in cart no longer exists"
            })
        }

        if(!product.isActive){
            return res.status(400).json({
                status:false,
                message:`${product.title} is no longer available`
            })
        }

        if(product.stock < item.quantity){
            return res.status(400).json({
                status:false,
                message:`Insufficient stock for ${product.title}`
            })
        }
       }

       // putting customersCart items into orderItems using maps

       const orderItems = customersCart.items.map((item)=>{
        const product = item.product;

        return {
            product:product._id,
            supplier:product.supplier,
            store:product.store,
            title:product.title,
            image:product.images?.[0]?.url || null,
            quantity:item.quantity,
            priceAtPurchase:item.priceAtAddition,
            totalPrice:item.quantity * item.priceAtAddition
        }
       });


        const subtotal = customersCart.subtotal;
        const discount=customersCart.discount;
        const total = customersCart.total;

        const order=await orderModel.create({
            user:userId,
            items:orderItems,
            shippingAddress,
            coupon:customersCart.coupon?._id || null,
            subtotal,
            discount,
            total,
            orderStatus:"pending",
            paymentStatus:"pending"
        });

        // Reduce stock for each ordered product

        for (const item of customersCart.items) {
    const product = item.product;

    product.stock = product.stock - item.quantity;

    await product.save();
}

// If coupon applied, increment coupon usedCount by 1


if (customersCart.coupon) {
    customersCart.coupon.usedCount += 1;
    await customersCart.coupon.save();
}

// Clear cart:
customersCart.items = [];
customersCart.coupon = null;
customersCart.subtotal = 0;
customersCart.discount = 0;
customersCart.total = 0;

await customersCart.save();

return res.status(201).json({
    status: true,
    message: "Order placed successfully",
    data: {
        order
    }
});
 } catch (error) {
        next(error);
        
    }
};


export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User is not authenticated"
            });
        }

        const orders = await orderModel
            .find({ user: userId })
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

export const getOrderById = async (req, res, next) => {
    try {
        const validationResult = await orderIdParamSchema.safeParseAsync(req.params);

        if (!validationResult.success) {
            return res.status(400).json({
                status: false,
                message: "Enter valid order id"
            });
        }

        const { orderId } = validationResult.data;

        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User is not authenticated"
            });
        }

        const order = await orderModel.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Order fetched successfully",
            data: {
                order
            }
        });
    } catch (error) {
        next(error);
    }
};

export const cancelOrder = async (req, res, next) => {
    try {
        const paramsValidation = await orderIdParamSchema.safeParseAsync(req.params);

        if (!paramsValidation.success) {
            return res.status(400).json({
                status: false,
                message: "Enter valid order id"
            });
        }

        const bodyValidation = await cancelOrderSchema.safeParseAsync(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                status: false,
                message: "Enter valid cancel reason"
            });
        }

        const { orderId } = paramsValidation.data;
        const { cancelReason } = bodyValidation.data;

        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User is not authenticated"
            });
        }

        const order = await orderModel.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            return res.status(404).json({
                status: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus === "cancelled") {
            return res.status(400).json({
                status: false,
                message: "Order is already cancelled"
            });
        }

        // Check if order.orderStatus exists in the ["shipped", "delivered"] array.
        if (["shipped", "delivered"].includes(order.orderStatus)) {
            return res.status(400).json({
                status: false,
                message: "Shipped or delivered order cannot be cancelled"
            });
        }

        order.orderStatus = "cancelled";
        order.cancelledAt = new Date();
        order.cancelReason = cancelReason || null;

        await order.save();

        return res.status(200).json({
            status: true,
            message: "Order cancelled successfully",
            data: {
                order
            }
        });
    } catch (error) {
        next(error);
    }
};

