import crypto from "crypto"

import paymentModel from "../../models/payment.model.js";
import orderModel from "../../models/order.model.js";
import razorpayInstance from "../../config/razorpay.config.js";

import { createNotification } from "../../services/notification.services.js";

import {createPaymentSchema, paymentFailureSchema, verifyPaymentSchema} from "../../validations/payment.validation.js";




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
};



export const verifyPayment=async(req,res,next)=>{
    try {
        const verifyValidationResult =await verifyPaymentSchema.safeParseAsync(req.body);

        if(!verifyValidationResult.success){
            return res.status(400).json({
                status:false,
                message:"invalid body"
            })
        };


        const {razorpayOrderId,razorpayPaymentId,razorpaySignature}=verifyValidationResult.data;

        const payment = await paymentModel.findOne({
            razorpayOrderId,
        });

        if(!payment){
            return res.status(404).json({
                status:false,
                message:"Payment not found"
            })
        };


        if(payment.status==="success"){
            return res.status(400).json({
                status:false,
                message:"Payment is already successfull"
            })
        };

        const body = razorpayOrderId+"|"+razorpayPaymentId;

        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_API_SECRET)
        .update(body)
        .digest("hex");



        if(expectedSignature!==razorpaySignature){
            return res.status(400).json({
                status:false,
                message:"Invalid payment signature"
            })
        };

        payment.razorpayPaymentId=razorpayPaymentId;
        payment.razorpaySignature=razorpaySignature;
        payment.status="success";
        payment.paidAt=new Date();

        



        const order= await orderModel.findOne({
            user:req.user?.id,
             _id: payment.order, 
             // this mean take the order id of payment schema order

        });

        if (!order) {
    return res.status(404).json({
        status: false,
        message: "Order not found"
    });
};

    if(order.orderStatus==="cancelled"){
        return res.status(400).json({
            status:false,
            message:"Order payment is cancelled"
        })
    };


    // NOW here we will give notification using the function created in notification
        //notification.services.js

        await createNotification({
  user: order.user,
  title: "Payment successful",
  message: `Your payment for order #${order._id} was successful.`,
  type: "payment",
  relatedOrder: order._id,
});

        order.paymentStatus="paid";
        await order.save();
        await payment.save();

        return res.status(200).json({
            status:true,
            message:"Payment successfull",
            data:{
                payment,
                order
            }
        });
    
    } catch (error) {
        next(error);
        
    }
}


export const paymentFailure=async(req,res,next)=>{
    try {
        const razorpayOrderIdValidation = await paymentFailureSchema.safeParseAsync(req.body);

        if(!razorpayOrderIdValidation.success){
            return res.status(400).json({
                status:false,
                message:"orderId is invalid"
            })
        };

        const {razorpayOrderId} = razorpayOrderIdValidation.data;


        const payment = await paymentModel.findOne({
            razorpayOrderId
        });

        if(!payment){
            return res.status(404).json({
                status:false,
                message:"payment not found"
            })
        };

        const order = await orderModel.findOne({
            _id:payment.order,
            user:req.user?.id
        })

        if(!order){
            return res.status(400).json({
                status:false,
                message:"order not found"
            })
        }

        if (payment.status === "success") {
    return res.status(400).json({
        status: false,
        message: "Successful payment cannot be marked as failed"
    });
}

        order.paymentStatus="failed";
        payment.status="failed"

        await payment.save();
        await order.save();

        return res.status(200).json({
            status:true,
            message:"Payment failed recorded successfully",
            data:{
                payment,
                order
            }
        })
    } catch (error) {
        next(error);
        
    }
}