import orderModel from "../../models/order.model.js";
import { orderIdParamSchema } from "../../validations/order.validation.js";

export const getSupplierOrders =async(req,res,next)=>{
    try {
        const supplierId= req.user?.id;

        if(!supplierId){
            return res.status(404).json({
                status:false,
                message:"User is not authenticated"
            })
        };

        const order = await orderModel.find({
            "items.supplier":supplierId
        }).sort({createdAt:-1});

       

        return res.status(200).json({
            status:true,
            message:"Here are your order's",
            data:{
                order
            }
        
        })
    } catch (error) {
        next(error);
        
    }
};

export const getSupplierOrderById=async(req,res,next)=>{
    try {
        const validateOrderId = await orderIdParamSchema.safeParseAsync(req.params);

        if(!validateOrderId.success){
            return res.status(400).json({
                status:false,
                message:"Enter valid order id"
            });
        }

    const {orderId}=validateOrderId.data;

        const supplierId=req.user?.id;

        if (!supplierId) {
    return res.status(400).json({
        status: false,
        message: "User is not authenticated"
    });
}



        const order = await orderModel.findOne({
            _id:orderId,
            "items.supplier":supplierId
        });

        if(!order){
            return res.status(404).json({
                status:false,
                message:"Order not found"
            })
        };

       return res.status(200).json({
    status: true,
    message: "Supplier order fetched successfully",
    data: {
        order
    }
});
        
}catch(error) {
        next(error);
        
    }
}