import paymentModel from "../../models/payment.model.js";
import orderModel from "../../models/order.model.js";
import razorpayInstance from "../../config/razorpay.config.js";

import {createPaymentSchema} from "../../validations/payment.validation.js";



// THIS ROUTE WILL NOT MARK AS PAYMENT PAID ,IT WILL BE DONE BY VERIFYPAYMENT
export const createPayment=async(req,res,next)=>{
    try {
        const orderIdValidationResult = await createPaymentSchema.safeParseAsync(req.body);

        if(!orderIdValidationResult.success){
            return res.status(400).json({
                status:false,
                message:"order ID is not Valid"
            })
        };

        const {orderId}= orderIdValidationResult.data;


        const userId=req.user?.id;

        if(!userId){
            return res.status(404).json({
                status:false,
                message:"User not Found"
            })
        };

        const order = await orderModel.findOne({
            user:userId,
            _id:orderId
        });

        if(!order){
            return res.status(404).json({
                status:false,
                message:"order not found"
            })
        };

        if (order.paymentStatus === "paid") {
    return res.status(400).json({
        status: false,
        message: "Order is already paid"
    });
}


        if(order.orderStatus==="cancelled"){
            return res.status(400).json({
                status:false,
                message:"Order is been cancelled"
            })
        };


        const amount = order.total*100;

        // Creating Razorpay order by user Instance (IMPORTANT SEE AGAIN) 

        const razorpayOrder = await razorpayInstance.orders.create({
            amount,
            currency:"INR",
            receipt:`order_${order._id}`
        });

        const payment=await paymentModel.create({
            order:order._id,
            user:userId,
            razorpayOrderId:razorpayOrder.id,
            amount:razorpayOrder.amount,
            currency:razorpayOrder.currency,
            status:"created"
 });

 return res.status(201).json({
    status:true,
    message:"Payment order created successfully",
    data:{
        payment,

        //THIS ALL THING IS FOR FRONTEND AFTER CONNECTION 

        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_API_KEY

    }
 });
        
    } catch (error) {
        next(error);
        
    }
}